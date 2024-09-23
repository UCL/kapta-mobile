import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { submitData } from "./data_submission.js";
import "./styles/map-etc.css";
import html2canvas from "html2canvas";
import {
	shareIcn,
	closeIcon,
	imageIcn,
	dataIcn,
	uploadIcn,
	chevronUp,
	addMetaIcn,
	exitButtonIcon,
	msgIcon,
} from "./icons";
import { slugify } from "./utils.js";

const config = require("./config.json");

function ShareBtn({ setOpen }) {
	const openShareModal = () => setOpen(true);
	return (
		<button type="button" className="share" onClick={openShareModal}>
			{shareIcn}
		</button>
	);
}
function SubmitBtn() {
	return (
		<button type="submit" className="submit">
			{chevronUp}
		</button>
	);
}

function InputArea({ setTitle, setPulse, setModalOpen, currentDataset }) {
	const { t } = useTranslation();
	const [isSubmit, setIsSubmit] = useState(false);
	const [filterValue, setFilterValue] = useState("");
	const [placeholderValue, setPlaceholderValue] = useState(t("addDescription"));

	const handleSubmit = (e) => {
		e.preventDefault();
		let topic = filterValue;

		currentDataset.features?.forEach((feature) => {
			feature.properties.topic = topic;
		});

		// Create slug from topic and add to dataset
		const slug = slugify(`${currentDataset.slug}-${topic}`);
		currentDataset.slug = slug;

		setTitle(topic);
		setPulse(true);
		setFilterValue("");
		setPlaceholderValue(t("updateDescription"));
		setIsSubmit(false);
	};

	const handleInputChange = (e) => {
		const value = e.target.value;
		setFilterValue(value);
		if (value.length >= 1) setIsSubmit(true);
	};

	return (
		<form className="filter__form" onSubmit={handleSubmit}>
			<div className="filter__wrapper">
				<textarea
					placeholder={placeholderValue}
					name="filter"
					onChange={handleInputChange}
					value={filterValue}
				></textarea>
			</div>
			{isSubmit ? <SubmitBtn /> : <ShareBtn setOpen={setModalOpen} />}
		</form>
	);
}
export function MapActionArea({
	setTitle,
	setPulse,
	showMenu,
	setModalOpen,
	currentDataset,
}) {
	return (
		<div id="map-actions-container">
			<div className="map-actions__wrapper">
				<div className="map-actions__body">
					<button id="exit-map" className="btn" onClick={showMenu}>
						{exitButtonIcon}
					</button>
					<InputArea
						setTitle={setTitle}
						setPulse={setPulse}
						setModalOpen={setModalOpen}
						currentDataset={currentDataset}
					/>
				</div>
			</div>
		</div>
	);
}

// Modal stuff
export function ShareModal({ isOpen, setIsOpen, currentDataset }) {
	if (!isOpen) return null;

	const { t } = useTranslation();
	let hasCognito = Alpine.store("appData")?.hasCognito;
	const user = Alpine.store("user");
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const filenameSlug = currentDataset.slug;
	const shareContent = {
		title: "#MadeWithKapta",
		text: "Create your WhatsApp Maps with Kapta https://kapta.earth/",
		url: "https://kapta.earth/",
	};
	const handleShareImgClick = () => {
		let errorMsg;
		html2canvas(document.querySelector("#map"), {
			allowTaint: true,
			useCORS: true,
			imageTimeout: 5000,
			removeContainer: true,
			logging: false,
			foreignObjectRendering: false,
			ignoreElements: function (element) {
				if ("button" == element.type || "submit" == element.type) {
					return true;
				}
				if (element.classList.contains("buttons")) {
					return true;
				}
				if (element.id === "map-actions-container") {
					return true;
				}
			},
		}).then(async function (canvas) {
			const dataURL = canvas.toDataURL();
			const blob = await (await fetch(dataURL)).blob();
			const filename = `${filenameSlug}.png`;
			const filesArray = [
				new File([blob], filename, {
					type: blob.type,
					lastModified: new Date().getTime(),
				}),
			];
			const shareData = {
				files: filesArray,
			};
			if (navigator.canShare && navigator.canShare(shareData)) {
				navigator
					.share({
						files: filesArray,
						...shareContent,
					})
					.then(() => {
						errorMsg = "Failed to share map image";
					});
			} else {
				try {
					errorMsg = "Sharing not supported, image copied to clipboard";
					navigator.clipboard.write([
						new ClipboardItem({
							"image/png": blob,
						}),
					]);
				} catch (error) {
					console.error(error);
					errorMsg = "Failed to write image to clipboard";
				}
			}
			if (errorMsg) {
				// TODO: replace with error popup?
				const dialog = document.createElement("dialog");
				dialog.textContent = errorMsg;
				dialog.classList.add("error-dialog");
				document.body.appendChild(dialog);
				dialog.showModal();
				dialog.classList.add("showing");
				setTimeout(() => {
					dialog.classList.remove("showing");
					setTimeout(() => {
						dialog.remove();
					}, 1000);
				}, 3000);
			}
		});
	};
	const downloadFile = (blob, filename) => {
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	};
	const handleShareDataClick = () => {
		const filename = `${filenameSlug}-${new Date().toDateString()}.txt`;
		const blob = new Blob([JSON.stringify(currentDataset, null, 2)], {
			type: "text/plain",
		});
		const filesArray = [
			new File([blob], filename, {
				type: blob.type,
				lastModified: new Date().getTime(),
			}),
		];
		const shareData = {
			files: filesArray,
		};
		if (navigator.canShare && navigator.canShare(shareData)) {
			navigator
				.share({
					files: filesArray,
					...shareContent,
				})
				.then(
					() => console.info("Data shared"),
					() => console.error("Failed to share data")
				);
		} else if (!Alpine.store("deviceInfo").isMobile) {
			downloadFile(blob, filename);
		}
	};
	const handleUploadClick = async () => {
		setIsDialogOpen(true).then(
			function () {
				let idToken = Alpine.store("user").idToken;
				submitData(currentDataset.geoJSON, idToken);
			},
			function (rejectReason) {
				console.error(rejectReason);
			}
		);
	};
	const handleHelpClick = (evt) => {
		evt.target.style.backgroundColor = "#a6a4a4";
		setTimeout(() => {
			window.location.href = config.kapta.askTheTeamURL;
			evt.target.style.backgroundColor = "white";
		}, 500);
	};
	return (
		<>
			<MetaDataDialog isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />
			<div id="sharing-modal">
				<button className="modal-close btn" onClick={() => setIsOpen(false)}>
					{closeIcon}
				</button>
				<div className="modal-title">{t("sharingTitle")}</div>
				<div className="option-button-container">
					<button className="btn" onClick={handleShareImgClick}>
						{imageIcn}
						{t("shareimg")}
					</button>
					<button className="btn" onClick={handleShareDataClick}>
						{dataIcn}
						{t("sharedata")}
					</button>
					{hasCognito && (
						<button
							className={`btn ${!user.logged_in && "disabled"}`}
							onClick={handleUploadClick}
							disabled={!user.logged_in}
						>
							{uploadIcn}
							{user.logged_in ? t("uploaddata") : "Log in to upload data"}
						</button>
					)}

					<button className="btn" onClick={handleHelpClick}>
						{msgIcon}
						{t("supportOption")}
					</button>
				</div>
			</div>
		</>
	);
}

export function MetaDataDialog({ isOpen, setIsOpen }) {
	if (!isOpen) return null;
	const { t } = useTranslation();
	const [isChecked, setIsChecked] = useState(false);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (isChecked == true) {
			resolve(true);
		} else {
			reject("Permission not given");
		}
		setIsOpen(false);
	};
	return (
		<dialog id="upload-dialog" open>
			<form className="upload-form" onSubmit={handleSubmit}>
				<h3>Upload data to Kapta</h3>
				<small>
					{t("addMetadataTitle")} {addMetaIcn}
				</small>

				<label for="input-topic">{t("inputtopiclabel")}</label>
				<textarea name="input-topic" id="input-topic"></textarea>

				<label for="input-goal">{t("inputgoallabel")}</label>
				<textarea name="input-goal" id="input-goal"></textarea>
				<label for="data-sov">{t("datasovmessage")}</label>
				<label for="data-sov" class="toggle">
					<input
						type="checkbox"
						id="data-sov"
						name="data-sov"
						class="toggle-input"
						checked={isChecked}
						onChange={(e) => setIsChecked(e.target.checked)}
					/>
					<span
						class="toggle-label"
						data-on={t("yes")}
						data-off={t("no")}
					></span>
					<span class="toggle-handle"></span>
				</label>
				<div className="btn-area">
					<button className="cancel btn" onClick={() => setIsOpen(false)}>
						{t("cancel")}
					</button>
					<button type="submit" className="confirm btn" disabled={!isChecked}>
						{t("confirm")}
					</button>
				</div>
			</form>
		</dialog>
	);
}

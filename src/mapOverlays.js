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
import { isMobileOrTablet } from "./main.js";
import { useUserStore } from "./UserContext.js";
import { ASK_URL, hasCognito } from "../globals.js";
import { UploadDialog } from "./UploadDialog.jsx";

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
					<button id="exit-map" type="button" onClick={showMenu}>
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
export function ShareModal({
	isOpen,
	setIsOpen,
	currentDataset,
	setIsUploadDialogOpen,
}) {
	if (!isOpen) return null;

	const { t } = useTranslation();
	const user = useUserStore();
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
		} else if (!isMobileOrTablet()) {
			downloadFile(blob, filename);
		}
	};
	const handleUploadClick = () => {
		setIsUploadDialogOpen(true);
		setIsOpen(false);
		// login stuff handled in the component
	};
	const handleHelpClick = (evt) => {
		evt.target.style.backgroundColor = "#a6a4a4";
		setTimeout(() => {
			window.location.href = ASK_URL;
			evt.target.style.backgroundColor = "white";
		}, 500);
	};
	return (
		<>
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
							className={`btn ${!user.loggedIn && "disabled"}`}
							onClick={handleUploadClick}
						>
							{uploadIcn}
							{user.loggedIn ? t("uploaddata") : "Log in to upload data"}
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

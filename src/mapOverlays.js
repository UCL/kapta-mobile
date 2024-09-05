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

function InputArea({ setTitle, setPulse, setModalOpen }) {
	const { t } = useTranslation();
	const [isSubmit, setIsSubmit] = useState(false);
	const [filterValue, setFilterValue] = useState("");
	const [placeholderValue, setPlaceholderValue] = useState(t("addDescription"));

	const handleSubmit = (e) => {
		e.preventDefault();
		let topic = filterValue;

		if (topic != "") Alpine.store("appData").mapTitle = topic;
		let currentDataset = Alpine.store("currentDataset");
		// Add topic, goal, dataSov to geoJSON

		currentDataset.geoJSON?.features.forEach((feature) => {
			feature.properties.topic = topic;
		});

		// Create slug from topic and add to Alpine store
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
export function MapActionArea({ setTitle, setPulse, showMenu, setModalOpen }) {
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
					/>
				</div>
			</div>
		</div>
	);
}

// Modal stuff
export function ShareModal({ isOpen }) {
	if (!isOpen) return null;

	const { t } = useTranslation();
	let hasCognito = Alpine.store("appData")?.hasCognito;
	const user = Alpine.store("user");
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const handleShareImgClick = () => {
		let errorMsg;
		html2canvas(document.querySelector("#map"), {
			allowTaint: true,
			useCORS: true,
			imageTimeout: 5000,
			removeContainer: true,
			logging: true,
			foreignObjectRendering: false,
			ignoreElements: function (element) {
				var src = element.src;
				if ("button" == element.type || "submit" == element.type) {
					return true;
				}
				if (element.classList.contains("buttons")) {
					return true;
				}
			},
		}).then(async function (canvas) {
			const dataURL = canvas.toDataURL();
			const blob = await (await fetch(dataURL)).blob();
			const filename = `${Alpine.store("currentDataset").slug}.png`;
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
						title: "#MadeWithKapta",
						text: "Create your WhatsApp Maps with Kapta https://kapta.earth/",
						url: "https://kapta.earth/",
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
		const currentDataset = Alpine.store("currentDataset").geoJSON;
		const filename = `${
			Alpine.store("currentDataset").slug
		}-${new Date().toDateString()}.txt`;
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
					title: "#MadeWithKapta",
					text: "#MadeWithKapta",
					url: "https://kapta.earth/",
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
				let currentDataset = Alpine.store("currentDataset");
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
				<button className="modal-close btn">{closeIcon}</button>
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
// export function closeModal(setIsOpen) {
// 	//might not need this
// 	return setIsOpen(false);
// }
// export function closeModal(modal) {
// 	var main = document.getElementById("main");
// 	modal.innerHTML = "";
// 	modal.classList.remove("visible");
// 	main.onclick = null;
// 	if (modal.id == "sharing-modal") {
// 		switchToShareBtn(document.getElementById("tray__button"));
// 	}
// }

// export function makeModalVisible(modal) {
// 	var main = document.getElementById("main");
// 	modal.classList.add("visible");
// 	modal.classList.remove("invisible");

// 	setTimeout(function () {
// 		main.onclick = function () {
// 			closeModal(modal);
// 		};
// 	}, 50);
// }

function addAlpineResizing(elem) {
	elem.setAttribute(
		"x-data",
		"{ resize: () => { $el.style.height = '5px'; $el.style.height = $el.scrollHeight + 'px' } }"
	);
	elem.setAttribute("x-init", "resize()");
	elem.setAttribute("x-on:input", "resize()");
}

// function addMetadataAction(form) {
// const header = document.createElement("div");
// const title = i18next.t("addMetadataTitle");
// header.innerHTML = `<span>${title} ${addMetaIcn}`;
// What have you mapped?
// const inputTopicLbl = document.createElement("label");
// inputTopicLbl.for = "input-topic";
// inputTopicLbl.textContent = i18next.t("inputtopiclabel");
// const inputTopic = document.createElement("textarea");
// inputTopic.id = "input-topic";
// inputTopic.name = "input-topic";
// addAlpineResizing(inputTopic);
// What do you want to achieve with this map?
// const inputGoalLbl = document.createElement("label");
// inputGoalLbl.for = "input-goal";
// inputGoalLbl.textContent = i18next.t("inputgoallabel");
// const inputGoal = document.createElement("textarea");
// inputGoal.id = "input-goal";
// inputGoal.name = "input-goal";
// addAlpineResizing(inputGoal);
// form.appendChild(inputTopicLbl);
// form.appendChild(inputTopic);
// form.appendChild(inputGoalLbl);
// form.appendChild(inputGoal);
// }

export function MetaDataDialog({ isOpen, setIsOpen }) {
	if (!isOpen) return null;
	// will need to add more translations for this
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
		<dialog id="upload-dialog">
			<form className="upload-form" onSubmit={handleSubmit}>
				<h3>Upload data to Kapta</h3>
				<small>Tell us about your data</small>
				<div>
					<span>
						{t("addMetadataTitle")}
						{addMetaIcn}
					</span>
					<label for="input-topic">
						{t("inputtopiclabel")}
						<textarea name="input-topic" id="input-topic"></textarea>
					</label>
					<label for="input-goal">
						{t("inputgoallabel")}
						<textarea name="input-goal" id="input-goal"></textarea>
					</label>
				</div>
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
// function confirmUploadPermission() {
// 	// we can do this with state
// 	return new Promise(async function (resolve, reject) {
// 		// const dialog = document.createElement("dialog");
// 		// dialog.id = "upload-dialog";
// 		// const form = document.createElement("form");
// 		// form.classList.add("upload-form");

// 		// var title = document.createElement("h3");
// 		// title.textContent = "Upload data to Kapta";
// 		// var subtitle = document.createElement("small");
// 		// subtitle.textContent = "Tell us about your data";

// 		// form.appendChild(title);
// 		// form.appendChild(subtitle);

// 		addMetadataAction(form);
// 		// Do you allow us to use your data to help support your community?
// 		// const dataSovQ = document.createElement("label");
// 		// dataSovQ.textContent = i18next.t("datasovmessage");
// 		// dataSovQ.for = "data-sov";
// 		// const dataSovLbl = document.createElement("label");
// 		// dataSovLbl.for = "data-sov";
// 		// dataSovLbl.classList.add("toggle");
// 		// const dataSovInput = document.createElement("input");
// 		// dataSovInput.type = "checkbox";
// 		// dataSovInput.id = "data-sov";
// 		// dataSovInput.name = "data-sov";
// 		// dataSovInput.classList.add("toggle-input");
// 		// const dataSovOptLbl = document.createElement("span");
// 		// dataSovOptLbl.classList.add("toggle-label");
// 		// dataSovOptLbl.setAttribute("data-on", i18next.t("yes"));
// 		// dataSovOptLbl.setAttribute("data-off", i18next.t("no"));
// 		// const dataSovHandle = document.createElement("span");
// 		// dataSovHandle.classList.add("toggle-handle");

// 		// dataSovLbl.appendChild(dataSovInput);
// 		// dataSovLbl.appendChild(dataSovOptLbl);
// 		// dataSovLbl.appendChild(dataSovHandle);

// 		// var btnArea = document.createElement("div");
// 		// btnArea.classList.add("btn-area");
// 		// // Submit button
// 		// var submitBtn = document.createElement("button");
// 		// submitBtn.type = "submit";
// 		// submitBtn.classList.add("btn", "confirm");
// 		// submitBtn.textContent = i18next.t("confirm");
// 		// submitBtn.disabled = true;

// 		// dataSovInput.addEventListener("change", (e) => {
// 		// 	submitBtn.disabled = !e.target.checked;
// 		// });

// 		// Cancel button
// 		// var cancelBtn = document.createElement("button");
// 		// cancelBtn.classList.add("btn", "cancel");
// 		// cancelBtn.textContent = i18next.t("cancel");
// 		// cancelBtn.addEventListener("click", () => {
// 		// 	reject("Upload cancelled");
// 		// 	dialog.remove();
// 		// });

// 		// form.appendChild(dataSovQ);
// 		// form.appendChild(dataSovLbl);

// 		// btnArea.appendChild(cancelBtn);
// 		// btnArea.appendChild(submitBtn);

// 		// form.appendChild(btnArea);

// 		// form.addEventListener("submit", (e) => {
// 		// 	e.preventDefault();
// 		// 	let formData = new FormData(form);
// 		// 	let dataSov = formData.get("data-sov");
// 		// 	if (dataSov == "on") {
// 		// 		resolve(true);
// 		// 	} else {
// 		// 		reject("Permission not given");
// 		// 	}
// 		// 	dialog.remove();
// 		// });

// 		// dialog.appendChild(form);
// 		// document.body.appendChild(dialog);
// 		// dialog.showModal();
// 	});
// }

import { submitData } from "./data_submission.js";
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
import { i18next } from "./languages.js";
import { removeMap } from "./map.js";

const config = require("./config.json");

function switchToShareBtn(btn) {
	btn.type = "button";
	btn.innerHTML = shareIcn;
	btn.onclick = sharingAction;
	btn.className = "share";
}
function switchToSubmitBtn(btn) {
	btn.type = "submit";
	btn.innerHTML = chevronUp;
	btn.onclick = null;
	btn.className = "submit";
}

function createInputArea() {
	var form = document.createElement("form");
	form.classList.add("filter__form");
	var inputWrapper = document.createElement("div");
	inputWrapper.classList.add("filter__wrapper");
	var input = document.createElement("textarea");
	inputWrapper.appendChild(input);
	input.placeholder = i18next.t("addDescription");
	input.name = "filter";

	form.appendChild(inputWrapper);

	return form;
}

export function buildActionTray() {
	const actionTray = document.createElement("div");
	actionTray.id = "map-actions-container";

	actionTray.innerHTML = `<div class="tray__wrapper">
    <div class="tray__body">
	<button id="exit-map" class="btn">${exitButtonIcon}</button>
	<div class="tray__filter"></div>
    </div>`;

	actionTray.querySelector("#exit-map").onclick = removeMap;

	const trayBody = actionTray.querySelector(".tray__body");

	const trayFilter = trayBody.querySelector(".tray__filter");
	trayFilter.appendChild(createInputArea());

	trayBody.appendChild(trayFilter);

	// Submit button should be share when no input and submit when input
	const submitBtn = document.createElement("button");
	submitBtn.id = "tray__button";

	switchToShareBtn(submitBtn);

	var form = trayFilter.querySelector(".filter__form");
	form.appendChild(submitBtn);

	var filterInput = trayBody.querySelector("textarea");
	filterInput.addEventListener("input", function () {
		if (filterInput.value.length >= 1) {
			switchToSubmitBtn(submitBtn);

			// Append all elements to the form
			form.addEventListener("submit", function (e) {
				e.preventDefault();
				let formData = new FormData(form);
				let topic = formData.get("filter");
				if (topic != "") Alpine.store("appData").mapTitle = topic;
				let currentDataset = Alpine.store("currentDataset");
				// Add topic, goal, dataSov to geoJSON
				if (currentDataset.geoJSON) {
					currentDataset.geoJSON.features.forEach((feature) => {
						feature.properties.topic = topic;
					});
				}
				// Create slug from topic and add to Alpine store
				const slug = `kapta-${slugify(topic)}`;
				currentDataset.slug = slug;
				let titleElem = document.querySelector(".leaflet-map-title");
				titleElem.textContent = Alpine.store("appData").mapTitle;

				form.querySelector("textarea").value = "";
				switchToShareBtn(submitBtn);
			});
		} else {
			switchToShareBtn(submitBtn);
		}
	});

	return actionTray;
}

function slugify(str) {
	str = str.replace(/^\s+|\s+$/g, ""); // trim leading/trailing white space
	str = str.toLowerCase();
	str = str
		.replace(/[^a-z0-9 -]/g, "") // remove any non-alphanumeric characters
		.replace(/\s+/g, "-") // replace spaces with hyphens
		.replace(/-+/g, "-"); // remove consecutive hyphens
	return str;
}

// Modal stuff
export function closeModal(modal) {
	var main = document.getElementById("main");
	modal.innerHTML = "";
	modal.classList.remove("visible");
	main.onclick = null;
	switchToShareBtn(document.getElementById("tray__button"));
}

function createModalCloseButton(modal) {
	var closeButton = document.createElement("button");
	closeButton.classList.add("modal-close", "btn");
	closeButton.innerHTML = closeIcon;
	closeButton.onclick = function () {
		closeModal(modal);
	};
	return closeButton;
}

function makeModalVisible(modal) {
	var main = document.getElementById("main");
	modal.classList.add("visible");
	modal.classList.remove("invisible");

	setTimeout(function () {
		main.onclick = function () {
			closeModal(modal);
		};
	}, 50);
}

// Sharing stuff
function sharingAction() {
	const header = document.createElement("div");
	const body = document.createElement("div");

	const modal = document.getElementById("sharing-modal");
	var closeButton = createModalCloseButton(modal);
	modal.appendChild(closeButton);
	modal.appendChild(header);
	modal.appendChild(body);

	makeModalVisible(modal);

	const title = i18next.t("sharingTitle");
	header.innerHTML = `<span class="modal-title">${title}`;

	const optionsContainer = document.createElement("div");
	optionsContainer.classList.add("option-button-container");

	const shareImgBtn = document.createElement("button");
	shareImgBtn.classList.add("btn");
	shareImgBtn.innerHTML = imageIcn + i18next.t("shareimg");
	shareImgBtn.addEventListener("click", () => {
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
				/* Remove element with id="MyElementIdHere" */
				if ("button" == element.type || "submit" == element.type) {
					return true;
				}
				/* Remove all elements with class="MyClassNameHere" */
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
						title: "#kapta",
						text: "#kapta",
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
	});
	optionsContainer.appendChild(shareImgBtn);

	const shareDataBtn = document.createElement("button");
	shareDataBtn.classList.add("btn");
	shareDataBtn.innerHTML = dataIcn + i18next.t("sharedata");
	shareDataBtn.addEventListener("click", () => {
		const currentDataset = Alpine.store("currentDataset").geoJSON;
		const filename = `${Alpine.store("currentDataset").slug}.txt`;
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
					title: "#kapta",
					text: "#kapta",
					url: "https://kapta.earth/",
				})
				.then(
					() => console.info("Data shared"),
					() => console.error("Failed to share data")
				);
		}
	});
	optionsContainer.appendChild(shareDataBtn);

	if (Alpine.store("appData").hasCognito) {
		const uploadDataBtn = document.createElement("button");
		uploadDataBtn.classList.add("btn");
		uploadDataBtn.innerHTML = uploadIcn;
		uploadDataBtn.setAttribute(
			"x-bind:disabled",
			"$store.user.logged_in===false"
		);
		uploadDataBtn.addEventListener("click", async () => {
			confirmUploadPermission().then(
				function () {
					let currentDataset = Alpine.store("currentDataset");
					let idToken = Alpine.store("user").idToken;
					submitData(currentDataset.geoJSON, idToken);
				},
				function (rejectReason) {
					console.error(rejectReason);
				}
			);
		});
		uploadDataBtn.insertAdjacentHTML(
			"beforeend",
			`
        <span x-show="$store.user.logged_in">
          ${i18next.t("uploaddata")}
        </span>
        <span x-show="$store.user.logged_in===false" class="disabled">
          Login to upload data
        </span>
        `
		);
		optionsContainer.appendChild(uploadDataBtn);
	}
	const helpBtn = document.createElement("button");
	helpBtn.id = "helpBtn";
	helpBtn.innerHTML = msgIcon + i18next.t("supportOption");
	helpBtn.classList.add("btn");
	helpBtn.addEventListener("click", (evt) => {
		evt.target.style.backgroundColor = "#a6a4a4";
		setTimeout(() => {
			window.location.href = config.kapta.askTheTeamURL;
			evt.target.style.backgroundColor = "white";
		}, 500);
	});
	optionsContainer.appendChild(helpBtn);

	body.appendChild(optionsContainer);

	return { header, body };
}

function addAlpineResizing(elem) {
	elem.setAttribute(
		"x-data",
		"{ resize: () => { $el.style.height = '5px'; $el.style.height = $el.scrollHeight + 'px' } }"
	);
	elem.setAttribute("x-init", "resize()");
	elem.setAttribute("x-on:input", "resize()");
}

function addMetadataAction(form) {
	const header = document.createElement("div");

	const title = i18next.t("addMetadataTitle");
	header.innerHTML = `<span>${title} ${addMetaIcn}`;

	// What have you mapped?
	const inputTopicLbl = document.createElement("label");
	inputTopicLbl.for = "input-topic";
	inputTopicLbl.textContent = i18next.t("inputtopiclabel");
	const inputTopic = document.createElement("textarea");
	inputTopic.id = "input-topic";
	inputTopic.name = "input-topic";

	addAlpineResizing(inputTopic);

	// What do you want to achieve with this map?
	const inputGoalLbl = document.createElement("label");
	inputGoalLbl.for = "input-goal";
	inputGoalLbl.textContent = i18next.t("inputgoallabel");
	const inputGoal = document.createElement("textarea");
	inputGoal.id = "input-goal";
	inputGoal.name = "input-goal";
	addAlpineResizing(inputGoal);

	form.appendChild(inputTopicLbl);
	form.appendChild(inputTopic);
	form.appendChild(inputGoalLbl);
	form.appendChild(inputGoal);
}

function confirmUploadPermission() {
	return new Promise(async function (resolve, reject) {
		const dialog = document.createElement("dialog");
		dialog.id = "upload-dialog";
		const form = document.createElement("form");
		form.classList.add("upload-form");

		var title = document.createElement("h3");
		title.textContent = "Upload data to Kapta";
		var subtitle = document.createElement("small");
		subtitle.textContent = "Tell us about your data";

		form.appendChild(title);
		form.appendChild(subtitle);

		addMetadataAction(form);
		// Do you allow us to use your data to help support your community?
		const dataSovQ = document.createElement("label");
		dataSovQ.textContent = i18next.t("datasovmessage");
		dataSovQ.for = "data-sov";
		const dataSovLbl = document.createElement("label");
		dataSovLbl.for = "data-sov";
		dataSovLbl.classList.add("toggle");
		const dataSovInput = document.createElement("input");
		dataSovInput.type = "checkbox";
		dataSovInput.id = "data-sov";
		dataSovInput.name = "data-sov";
		dataSovInput.classList.add("toggle-input");
		const dataSovOptLbl = document.createElement("span");
		dataSovOptLbl.classList.add("toggle-label");
		dataSovOptLbl.setAttribute("data-on", i18next.t("yes"));
		dataSovOptLbl.setAttribute("data-off", i18next.t("no"));
		const dataSovHandle = document.createElement("span");
		dataSovHandle.classList.add("toggle-handle");

		dataSovLbl.appendChild(dataSovInput);
		dataSovLbl.appendChild(dataSovOptLbl);
		dataSovLbl.appendChild(dataSovHandle);

		var btnArea = document.createElement("div");
		btnArea.classList.add("btn-area");
		// Submit button
		var submitBtn = document.createElement("button");
		submitBtn.type = "submit";
		submitBtn.classList.add("btn", "confirm");
		submitBtn.textContent = i18next.t("confirm");
		submitBtn.disabled = true;

		dataSovInput.addEventListener("change", (e) => {
			submitBtn.disabled = !e.target.checked;
		});

		// Cancel button
		var cancelBtn = document.createElement("button");
		cancelBtn.classList.add("btn", "cancel");
		cancelBtn.textContent = i18next.t("cancel");
		cancelBtn.addEventListener("click", () => {
			reject("Upload cancelled");
			dialog.remove();
		});

		form.appendChild(dataSovQ);
		form.appendChild(dataSovLbl);

		btnArea.appendChild(cancelBtn);
		btnArea.appendChild(submitBtn);

		form.appendChild(btnArea);

		form.addEventListener("submit", (e) => {
			e.preventDefault();
			let formData = new FormData(form);
			let dataSov = formData.get("data-sov");
			if (dataSov == "on") {
				resolve(true);
			} else {
				reject("Permission not given");
			}
			dialog.remove();
		});

		dialog.appendChild(form);
		document.body.appendChild(dialog);
		dialog.showModal();
	});
}

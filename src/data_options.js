import Alpine from "alpinejs";
import { i18next } from "./languages.js";
import { submitData } from "./data_submission.js";

function buildDataOptionsForm() {
	const form = document.createElement("form");
	form.id = "dataOptionsForm";

	// What have you mapped?
	const inputTopicLbl = document.createElement("label");
	inputTopicLbl.for = "input-topic";
	inputTopicLbl.textContent = i18next.t("inputtopiclabel");
	const inputTopic = document.createElement("textarea");
	inputTopic.id = "input-topic";
	inputTopic.name = "input-topic";
	inputTopic.setAttribute(
		"x-data",
		"{ resize: () => { $el.style.height = '5px'; $el.style.height = $el.scrollHeight + 'px' } }"
	);
	inputTopic.setAttribute("x-init", "resize()");
	inputTopic.setAttribute("x-on:input", "resize()");

	// What do you want to achieve with this map?
	const inputGoalLbl = document.createElement("label");
	inputGoalLbl.for = "input-goal";
	inputGoalLbl.textContent = i18next.t("inputgoallabel");
	const inputGoal = document.createElement("textarea");
	inputGoal.id = "input-goal";
	inputGoal.name = "input-goal";
	inputGoal.setAttribute(
		"x-data",
		"{ resize: () => { $el.style.height = '5px'; $el.style.height = $el.scrollHeight + 'px' } }"
	);
	inputGoal.setAttribute("x-init", "resize()");
	inputGoal.setAttribute("x-on:input", "resize()");

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

	// Submit button
	const submitBtn = document.createElement("button");
	submitBtn.type = "submit";
	submitBtn.textContent = i18next.t("confirm");

	// Append all elements to the form
	form.appendChild(inputTopicLbl);
	form.appendChild(inputTopic);
	form.appendChild(inputGoalLbl);
	form.appendChild(inputGoal);
	form.appendChild(dataSovQ);
	form.appendChild(dataSovLbl);
	form.appendChild(submitBtn);

	addPreExportListeners(form);

	return form;
}

function addPreExportListeners(form) {
	form.addEventListener("submit", function (e) {
		e.preventDefault();
		let formData = new FormData(form);
		let topic = formData.get("input-topic");
		let goal = formData.get("input-goal");
		let dataSov = formData.get("data-sov");
		let currentDataset = Alpine.store("currentDataset");
		if (dataSov == "on") {
			currentDataset.upload = true;
		} else {
			currentDataset.upload = false;
		}
		// Add topic, goal, dataSov to geoJSON
		if (currentDataset.geoJSON) {
			currentDataset.geoJSON.features.forEach((feature) => {
				feature.properties.topic = topic;
				feature.properties.goal = goal;
			});
		}
		// Upload data if permission has been given
		if (currentDataset.upload) {
			let idToken = Alpine.store("user").idToken;
			submitData(currentDataset.geoJSON, idToken);
		}
		displaySharingOptions();
	});
}

function buildSharingOptionsForm() {
	const form = document.createElement("form");
	const shareDataBtn = document.createElement("button");
	shareDataBtn.textContent = i18next.t("sharedata");
	shareDataBtn.addEventListener("click", (e) => {
		e.preventDefault();
	});
	const shareImgBtn = document.createElement("button");
	shareImgBtn.textContent = i18next.t("shareimg");
	shareImgBtn.addEventListener("click", (e) => {
		e.preventDefault();
		printBtn.printMap("A4Portrait", "Kapta.jpg");
	});

	form.appendChild(shareDataBtn);
	form.appendChild(shareImgBtn);
	return form;
}

function displaySharingOptions() {
	const form = buildSharingOptionsForm();
	const dialog = document.getElementById("data-options-dialog");
	let initialForm = dialog.getElementsByTagName("form")[0];
	initialForm.remove();
	dialog.appendChild(form);
}

function displayDataOptionsForm() {
	return new Promise(async function (resolve) {
		const form = buildDataOptionsForm();
		const dialog = document.createElement("dialog");
		form.addEventListener("submit", function (e) {
			e.preventDefault();
			let formData = new FormData(form);
			let topic = formData.get("input-topic");
			let goal = formData.get("input-goal");
			let dataSov = formData.get("data-sov");
			let currentDataset = Alpine.store("currentDataset");
			if (dataSov == "on") {
				currentDataset.upload = true;
			} else {
				currentDataset.upload = false;
			}
			// Add topic, goal, dataSov to geoJSON
			if (currentDataset.geoJSON) {
				currentDataset.geoJSON.features.forEach((feature) => {
					feature.properties.topic = topic;
					feature.properties.goal = goal;
				});
			}
			// Upload data if permission has been given
			if (currentDataset.upload) {
				let idToken = Alpine.store("user").idToken;
				submitData(currentDataset.geoJSON, idToken);
			}
			// Finally, close the dialog
			dialog.close();
			dialog.remove();
		});
		dialog.id = "data-options-dialog";
		dialog.appendChild(form);
		document.body.appendChild(dialog);
		dialog.showModal();
	});
}

export { displayDataOptionsForm };

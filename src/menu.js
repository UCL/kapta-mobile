import { displayMap } from "./map.js";
import { displayFile } from "./import_whatsapp.js";
import { i18next, supportedLanguages } from "./languages.js";
import Alpine from "alpinejs";
import { closeModal, makeModalVisible } from "./mapOverlays.js";

const config = require("./config.json");

function buildLanguageSelector() {
	const selector = document.createElement("select");
	selector.id = "languageSelector";

	// get saved language from localStorage if it's there
	const savedLanguage = localStorage.getItem("preferredLanguage");

	const initialLanguage = savedLanguage || i18next.language;

	Object.entries(supportedLanguages).forEach(([key, value]) => {
		let option = document.createElement("option");
		option.value = key;
		option.textContent = value;
		if (key === initialLanguage) {
			option.selected = true;
		}
		selector.appendChild(option);
	});

	selector.value = initialLanguage;

	selector.addEventListener("change", (evt) => {
		const selectedLanguage = evt.target.value;

		// Save the selected language to localStorage
		localStorage.setItem("preferredLanguage", selectedLanguage);

		i18next.changeLanguage(selectedLanguage).then((t) => {
			reloadOptionsMenu();
		});
	});

	return selector;
}
function displayVideoModal() {
	const videoModal = document.getElementById("video-modal");
	videoModal.innerHTML = `<div class="video-modal__inner"><button class="modal-close btn">&times;</button>
        <iframe id="videoElement" width="100%" height="500px"
    src="https://www.youtube.com/embed/PDOVl8smi2Q?si=CiIkw6_rm1TzmZgF" 
    frameborder="0" allow="autoplay; encrypted-media;" 
    allowfullscreen>
</iframe>
</div>`;
	videoModal.querySelector("button").onclick = () => closeModal(videoModal);
	
	if(i18next.language === "fr") {
		videoModal.innerHTML = `<div class="video-modal__inner"><button class="modal-close btn">&times;</button>
        <iframe id="videoElement" width="100%" height="500px"
    src="https://www.youtube.com/embed/Dd4dFC-J_Bo?si=CvzkDasZX-ocN-K2" 
    frameborder="0" allow="autoplay; encrypted-media;" 
    allowfullscreen>
</iframe>
</div>`;
	}
	// console.log(i18next.language);
	//if for other languages once we have the YouTube video in other languages

	makeModalVisible(videoModal);
}
function buildButtonArea() {
	var btnContainer = document.createElement("div");
	btnContainer.classList.add("button-area");
	// tutorial button
	const tutorialBtn = document.createElement("button");
	tutorialBtn.id = "tutorialBtn";
	tutorialBtn.innerText = i18next.t("watchtutorial");
	tutorialBtn.classList.add("btn");
	tutorialBtn.onclick = displayVideoModal;
	btnContainer.appendChild(tutorialBtn);

	// Help button
	const helpBtn = document.createElement("button");
	helpBtn.id = "helpBtn";
	helpBtn.innerText = i18next.t("asktheteam");
	helpBtn.classList.add("btn");
	btnContainer.appendChild(helpBtn);

	// Show most recent map
	if (Alpine.store("currentDataset").geoJSON) {
		const recentBtn = document.createElement("button");
		recentBtn.id = "recentBtn";
		recentBtn.innerText = i18next.t("viewrecentmap");
		recentBtn.classList.add("btn");
		recentBtn.addEventListener("click", () => {
			removeOptionsMenu();
			displayMap(Alpine.store("currentDataset").geoJSON);
		});
		btnContainer.appendChild(recentBtn);
	}

	// File picker (web only)
	if (!Alpine.store("deviceInfo").isMobile) {
		const fileInput = document.createElement("input");
		fileInput.type = "file";
		fileInput.accept = ".txt,.zip,.geojson";
		fileInput.classList.add("file-input");
		fileInput.addEventListener("change", (evt) => {
			displayFile(evt.target.files[0]);
			fileInput.value = null;
		});
		btnContainer.appendChild(fileInput);
	}
	return btnContainer;
}

function buildOptionsMenu() {
	const menuContainer = document.createElement("div");
	menuContainer.id = "menuContainer";

	// Language selector
	const languageSelector = buildLanguageSelector();
	menuContainer.appendChild(languageSelector);

	// Instructions
	const instructions = document.createElement("div");
	instructions.id = "instructions";
	instructions.innerHTML = i18next.t("instructions");
	menuContainer.appendChild(instructions);

	//buttons
	var btnContainer = buildButtonArea();
	menuContainer.appendChild(btnContainer);

	return menuContainer;
}

function addMenuListeners() {
	const helpBtn = document.querySelector("#helpBtn");
	helpBtn.addEventListener("click", (evt) => {
		evt.target.style.backgroundColor = "#a6a4a4";
		setTimeout(() => {
			window.location.href = config.kapta.askTheTeamURL;
			evt.target.style.backgroundColor = "white";
		}, 500);
	});
}

function displayOptionsMenu() {
	const optionsMenu = buildOptionsMenu();
	const parent = document.querySelector("#main");
	parent.appendChild(optionsMenu);
	addMenuListeners();

	// Copyright
	if (!document.getElementById("copyright")) {
		const copyright = document.createElement("div");
		copyright.id = "copyright";
		copyright.innerHTML = i18next.t("copyright");
		parent.appendChild(copyright);
	}
}

function removeOptionsMenu() {
	document.querySelector("#menuContainer").remove();
}

function reloadOptionsMenu() {
	removeOptionsMenu();
	document.getElementById("copyright").remove();
	displayOptionsMenu();
}

export { displayOptionsMenu, removeOptionsMenu };

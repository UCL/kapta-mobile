import { displayMap } from "./map.js";
import { displayFile } from "./import_whatsapp.js";
import { i18next, supportedLanguages } from "./languages.js";
import Alpine from "alpinejs";

const config = require("./config.json");

function buildLanguageSelector() {
	const selector = document.createElement("select");
	selector.id = "languageSelector";

	Object.entries(supportedLanguages).forEach(([key, value]) => {
		let option = document.createElement("option");
		option.value = key;
		option.textContent = value;
		if (key == i18next.language) {
			option.selected = "selected";
		}
		selector.appendChild(option);
	});
	selector.value = i18next.resolvedLanguage;
	selector.addEventListener("change", (evt) => {
		i18next.changeLanguage(evt.target.value).then((t) => {
			reloadOptionsMenu();
		});
	});
	return selector;
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

	// Help button
	const helpBtn = document.createElement("button");
	helpBtn.id = "helpBtn";
	helpBtn.innerText = i18next.t("asktheteam");
	helpBtn.classList.add("btn");
	menuContainer.appendChild(helpBtn);

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
		menuContainer.appendChild(recentBtn);
	}

	// File picker (web only)
	if (!Alpine.store("deviceInfo").isMobile) {
		const fileInput = document.createElement("input");
		fileInput.type = "file";
		fileInput.accept = ".txt,.zip";
		fileInput.classList.add("file-input");
		fileInput.addEventListener("change", (evt) => {
			displayFile(evt.target.files[0]);
			fileInput.value = null;
		});
		menuContainer.appendChild(fileInput);
	}

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
	const copyright = document.createElement("div");
	copyright.id = "copyright";
	copyright.innerHTML = i18next.t("copyright");
	parent.appendChild(copyright);
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

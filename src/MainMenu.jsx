import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { i18next, savedLanguage, supportedLanguages } from "./languages.js";
import { displayFile } from "./import_whatsapp.js";
import { displayMap } from "./map.js";
import "./styles/menu.css";
import config from "./config.json";
import { removeOptionsMenu } from "./main.js";

function LanguageSelector({ supportedLanguages }) {
	// Get the saved language from localStorage or fallback to i18next language
	const [selectedLanguage, setSelectedLanguage] = useState(() => {
		return savedLanguage || i18next.language;
	});

	// Handle language change
	const handleChange = (event) => {
		const newLanguage = event.target.value;
		localStorage.setItem("preferredLanguage", newLanguage);
		// Update the state to trigger a re-render
		setSelectedLanguage(newLanguage);
	};

	return (
		<select
			value={selectedLanguage}
			onChange={handleChange}
			id="languageSelector"
		>
			{Object.entries(supportedLanguages).map(([key, value]) => (
				<option key={key} value={key}>
					{value}
				</option>
			))}
		</select>
	);
}

function Instructions() {
	const { t } = useTranslation();
	return (
		<div
			id="instructions"
			dangerouslySetInnerHTML={{ __html: t("instructions") }}
		></div>
	);
}

function VideoModal({ isOpen, onClose }) {
	const { t } = useTranslation();

	if (!isOpen) return null;

	return (
		<div id="video-modal">
			<div className="video-modal__inner">
				<button className="modal-close btn" onClick={onClose}>
					&times;
				</button>
				<iframe
					id="videoElement"
					width="100%"
					height="500px"
					src={t("tutorialUrl")}
					frameborder="0"
					allow="autoplay; encrypted-media;"
					allowfullscreen
				></iframe>
			</div>
		</div>
	);
}

function RecentMapButton({ hasCurrentDataset }) {
	const handleRecentBtnClick = (hasCurrentDataset) => {
		removeOptionsMenu();
		displayMap(hasCurrentDataset);
	};
	return (
		<button
			id="recentBtn"
			className="btn menu-btn"
			onclick={handleRecentBtnClick(hasCurrentDataset)}
		>
			{t("viewrecentmap")}
		</button>
	);
}

function FilePicker() {
	const handleFileChange = (event) => {
		const file = event.target.files[0];
		displayFile(file);
		event.target.value = null; // Clear the input value
	};
	return (
		<input
			type="file"
			accept=".txt,.zip,.geojson"
			className="file-input"
			onChange={handleFileChange}
		/>
	);
}

function ButtonArea() {
	const [activeModal, setActiveModal] = useState(null);

	const openModal = (modalName) => setActiveModal(modalName);
	const closeModal = () => setActiveModal(null);

	const { t } = useTranslation();

	let hasCurrentDataset = Alpine.store("currentDataset")?.geoJSON || null;

	let isMobile = Alpine.store("deviceInfo")?.isMobile || null;

	return (
		<div className="button-area">
			<button
				id="tutorialBtn"
				onClick={() => openModal("videoTutorial")}
				className="btn menu-btn"
			>
				{t("watchtutorial")}
			</button>
			<VideoModal
				isOpen={activeModal === "videoTutorial"}
				onClose={closeModal}
			/>

			<button
				id="helpBtn"
				className="btn menu-btn"
				onClick={() => {
					window.location.href = config.kapta.askTheTeamURL;
				}}
			>
				{t("asktheteam")}
			</button>

			{/* show recent map */}
			{hasCurrentDataset && (
				<RecentMapButton hasCurrentDataset={hasCurrentDataset} />
			)}

			{/* File picker (web only) */}
			{!isMobile && <FilePicker />}
		</div>
	);
}

function Copyright() {
	const { t } = useTranslation();
	return <div id="copyright">{t("copyright")}</div>;
}

export default function MainMenu({ isVisible }) {
	return (
		<>
			{isVisible && (
				<div id="menuContainer">
					<LanguageSelector supportedLanguages={supportedLanguages} />
					<Instructions />
					<ButtonArea />
					<Copyright />
				</div>
			)}
		</>
	);
}

import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { i18next, savedLanguage, supportedLanguages } from "./languages.js";
import { parseFile } from "./import_whatsapp.js";
import "./styles/menu.css";
import StatusBar from "./StatusBar.jsx";
import config from "./config.json";

function LanguageSelector({ supportedLanguages }) {
	// Get the saved language from localStorage or fallback to i18next language
	const [selectedLanguage, setSelectedLanguage] = useState(() => {
		return savedLanguage || i18next.language;
	});

	// Handle language change
	const handleChange = (event) => {
		// set lang in local storage and il8next
		const newLanguage = event.target.value;
		localStorage.setItem("preferredLanguage", newLanguage);
		i18next.changeLanguage(newLanguage).catch((error) => {
			console.error("Error changing language", error);
		});
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

function VideoModal({ setIsOpen }) {
	const { t } = useTranslation();

	return (
		<div id="video-modal">
			<div className="video-modal__inner">
				<button className="modal-close btn" onClick={() => setIsOpen(false)}>
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

function RecentMapButton({ showMap }) {
	const { t } = useTranslation();
	return (
		<button id="recentBtn" className="btn menu-btn" onClick={showMap}>
			{t("viewrecentmap")}
		</button>
	);
}

function FilePicker(dataDisplayProps) {
	const handleFileChange = (event) => {
		const file = event.target.files[0];
		parseFile(file, dataDisplayProps);
		event.target.value = null; // Clear the input value
	};
	var filedisplayed = false;
	return (
		<input
			type="file"
			accept=".txt,.zip,.geojson"
			className="file-input"
			onChange={handleFileChange}
		/>
	);
}

function ButtonArea({ hasCurrentDataset, showMap }) {
	const [isOpen, setVideoIsOpen] = useState(false);

	const { t } = useTranslation();

	return (
		<div className="button-area">
			<button
				id="tutorialBtn"
				onClick={() => setVideoIsOpen(true)}
				className="btn menu-btn"
			>
				{t("watchtutorial")}
			</button>
			{isOpen && <VideoModal setIsOpen={setVideoIsOpen} />}

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
			{hasCurrentDataset && <RecentMapButton showMap={showMap} />}
		</div>
	);
}

function Copyright() {
	const { t } = useTranslation();
	return <div id="copyright">{t("copyright")}</div>;
}

export default function MainMenu({
	isVisible,
	showMap,
	setLoaderVisible,
	dataset,
	setMapData,
}) {
	const [isSBVisible, setIsSBVisible] = useState(false);

	// set status bar visibility based on if cognito in config
	useEffect(() => {
		const hasCognito = Alpine.store("appData")?.hasCognito;
		setIsSBVisible(hasCognito);
	});

	// if menu not visible, nor should status bar be
	useEffect(() => {
		if (!isVisible) setIsSBVisible(false);
	}, [isVisible]);

	if (!isVisible) return null;
	let isMobile = Alpine.store("deviceInfo")?.isMobile || null;

	const dataDisplayProps = {
		setMapData,
		showMap,
		setLoaderVisible,
	}; // setting these in an object so they're easier to pass
	return (
		<>
			<StatusBar isVisible={isSBVisible} />

			<div id="menuContainer">
				<LanguageSelector supportedLanguages={supportedLanguages} />
				<Instructions />
				<ButtonArea showMap={showMap} hasCurrentDataset={dataset} />
				{/* File picker (web only) */}
				{!isMobile && <FilePicker {...dataDisplayProps} />}
				<Copyright />
			</div>
		</>
	);
}

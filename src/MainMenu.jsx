import Alpine from "alpinejs";
import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { i18next, savedLanguage, supportedLanguages } from "./languages.js";
import { FileParser, allowedExtensions } from "./import_whatsapp.js";
import "./styles/menu.css";
import config from "./config.json";
import { isIOS } from "./main.js";
import ReactGA from "react-ga4";
import BurgerMenu from "./BurgerMenu.jsx";
import { menuIcon } from "./icons.js";

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
		ReactGA.event({
			category: "Language",
			action: "Language Changed",
			label: newLanguage,
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

function VideoModal({ isOpen, setIsOpen }) {
	if (!isOpen) return null;

	const { t } = useTranslation();

	useEffect(() => {
		if (isOpen) {
			ReactGA.event({
				category: "Tutorial",
				action: "Tutorial Opened",
			});

			const handleMainClick = () => {
				setIsOpen(false);
				document
					.querySelector("#main")
					.removeEventListener("click", handleMainClick);
			};
			document
				.querySelector("#main")
				.addEventListener("click", handleMainClick);
			return () => {
				document
					.querySelector("#main")
					.removeEventListener("click", handleMainClick);
			};
		}
	}, [isOpen, setIsOpen]);

	if (!isOpen) return null;

	return (
		<div id="video-modal">
			<div className="video-modal__inner">
				<button className="modal-close btn" onClick={() => setIsOpen(false)}>
					&times;
				</button>
				<iframe
					id="videoElement"
					width="99%"
					height="500px"
					src={t("tutorialUrl")}
					allow="autoplay; encrypted-media;"
					allowFullScreen
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
	const [selectedFile, setSelectedFile] = useState(null);
	const fileInputRef = useRef(null);

	const handleFileChange = (event) => {
		const file = event.target.files[0];
		file && setSelectedFile(file);
		event.target.value = null; // Clear the input value
	};

	const handleButtonClick = () => {
		fileInputRef.current.click();
	};

	const { t } = useTranslation();

	return (
		<>
			<input
				type="file"
				accept={allowedExtensions.join(",")}
				ref={fileInputRef}
				style={{ display: "none" }}
				onChange={handleFileChange}
			/>
			<button onClick={handleButtonClick} className="btn menu-btn file-input">
				{t("selectFile")}
			</button>
			{selectedFile && (
				<FileParser
					file={selectedFile}
					{...dataDisplayProps}
					onComplete={() => setSelectedFile(null)}
				/>
			)}
		</>
	);
}

function ButtonArea({ hasCurrentDataset, showMap }) {
	const [isOpen, setIsVideoOpen] = useState(false);

	const { t } = useTranslation();

	return (
		<>
			<VideoModal isOpen={isOpen} setIsOpen={setIsVideoOpen} />
			<div className="button-area">
				<button
					id="tutorialBtn"
					onClick={() => setIsVideoOpen(true)}
					className="btn menu-btn"
				>
					{t("watchtutorial")}
				</button>

				<button
					id="helpBtn"
					className="btn menu-btn"
					onClick={() => {
						ReactGA.event({
							category: "Help",
							action: "Help Button Clicked",
						});
						window.location.href = config.kapta.askTheTeamURL;
					}}
				>
					{t("asktheteam")}
				</button>

				{/* show recent map */}
				{hasCurrentDataset && <RecentMapButton showMap={showMap} />}
			</div>
		</>
	);
}

function Copyright() {
	const { t } = useTranslation();
	return <div id="copyright">{t("copyright")}</div>;
}

export default function MainMenu({ isVisible, dataset, ...dataDisplayProps }) {
	const { setMapData, showMap } = dataDisplayProps;
	const [isBMVisible, setIsBMVisible] = useState(false);

	const toggleBM = () => {
		setIsBMVisible((prevState) => !prevState);
	};

	if (!isVisible) return null;
	let isMobile = Alpine.store("deviceInfo")?.isMobile || null;

	return (
		<>
			<button onClick={toggleBM} className="btn--burger-menu">
				{menuIcon}
			</button>
			{isBMVisible && <BurgerMenu isVisible={isBMVisible} />}
			<div id="menuContainer">
				<LanguageSelector supportedLanguages={supportedLanguages} />
				<Instructions />
				<ButtonArea showMap={showMap} hasCurrentDataset={dataset} />
				{/* File picker (web only) */}
				{(!isMobile || isIOS()) && <FilePicker {...dataDisplayProps} />}
				<Copyright />
			</div>
		</>
	);
}

import Alpine from "alpinejs";
import React, { useEffect, useState } from "react";
import { i18next } from "./languages.js";
import ReactDOM from "react-dom/client";
import { FileParser } from "./import_whatsapp.js";
import { signOut, initiateAuthRefresh } from "./auth.js";
import { Map } from "./map.js";
import InstallDialog from "./Install.jsx";
import MainMenu from "./MainMenu.jsx";
import Loader from "./Loader.jsx";
import "./styles/main.css";
import ReactGA from "react-ga4";

window.Alpine = Alpine;

export const isMobileOrTablet = () => {
	return (
		/iPad|iPhone|iPod|android|Mobile|mini|Fennec|Symbian|Windows Phone|BlackBerry|IEMobile/i.test(
			navigator.userAgent
		) ||
		(window.innerWidth <= 1024 &&
			("ontouchstart" in window || navigator.maxTouchPoints > 0))
	);
};
export const isIOS = () => {
	return /iPad|iPhone|iPod/i.test(navigator.userAgent);
};
export const hasCognito = () => {
	const config = require("./config.json");
	if (config.cognito) return true;
	else return false;
};

function initServiceWorker(setFileToParse) {
	if ("serviceWorker" in navigator) {
		window.addEventListener("load", () => {
			navigator.serviceWorker
				.register("/sw.js")
				.then((registration) => {
					console.info("SW registered: ", registration);
				})
				.catch((registrationError) => {
					console.info("SW registration failed: ", registrationError);
				});
		});

		if (!isMobileOrTablet() || isIOS()) {
			window.addEventListener("load", function () {
				const shownWorksBestOnAndroid = localStorage.getItem(
					"shownWorksBestOnAndroid"
				);

				if (!shownWorksBestOnAndroid) {
					alert(i18next.t("desktoporiosPrompt")); // using like this since can't use useTranslation outside a component
					localStorage.setItem("shownWorksBestOnAndroid", "true");
				}
			});
		}
	}

	navigator.serviceWorker.addEventListener("message", (event) => {
		if (event.data.action !== "load-map") return;
		return setFileToParse(event.data.file);
	});

	navigator.serviceWorker.controller?.postMessage("share-ready");
}

function App() {
	const [fileToParse, setFileToParse] = useState(null);

	useEffect(() => {
		// Initialize GA and SW
		initServiceWorker(setFileToParse);
		ReactGA.initialize("G-LEP1Y0FVCD");
	}, []); // Empty dependency array ensures this effect runs once on mount
	const [isMenuVisible, setIsMenuVisible] = useState(true);
	const [isMapVisible, setIsMapVisible] = useState(false);
	const [mapData, setMapData] = useState(null);
	const [isLoaderVisible, setIsLoaderVisible] = useState(false);
	// if map/menu is visible, the other shouldn't be
	const showMap = () => {
		setIsLoaderVisible(true);
		setIsMapVisible(true);
		setIsMenuVisible(false);
	};
	const showMenu = () => {
		setIsLoaderVisible(true);
		setIsMapVisible(false);
		setIsMenuVisible(true);
	};
	const dataDisplayProps = {
		setMapData,
		showMap,
		setFileToParse,
	}; // setting these in an object so they're easier to pass and update

	return (
		<>
			<InstallDialog />
			<Loader isVisible={isLoaderVisible} setIsVisible={setIsLoaderVisible} />

			<MainMenu
				isVisible={isMenuVisible}
				setLoaderVisible={setIsLoaderVisible}
				dataset={mapData}
				{...dataDisplayProps}
			/>
			{fileToParse && <FileParser file={fileToParse} {...dataDisplayProps} />}
			<Map isVisible={isMapVisible} showMenu={showMenu} data={mapData} />
		</>
	);
}

const rootElement = document.getElementById("main");
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);

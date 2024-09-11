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
function initAlpine() {
	//may want to entirely convert to state or context
	Alpine.store("deviceInfo", {
		init() {
			this.isMobile = isMobileOrTablet();
		},
		isMobile: true,
	});
	Alpine.store("currentDataset", {
		geoJSON: null,
		slug: null,
	});
	Alpine.store("appData", {
		init() {
			const config = require("./config.json");
			if (config.cognito) this.hasCognito = true;
		},
		hasCognito: false,
		mapTitle: null,
	});
	Alpine.store("user", {
		init() {
			this.idToken = localStorage.getItem("idToken");
			this.accessToken = localStorage.getItem("accessToken");
			this.refreshToken = localStorage.getItem("refreshToken");

			Alpine.effect(() => {
				["idToken", "accessToken", "refreshToken"].forEach((key) => {
					if (this[key] === null) {
						localStorage.removeItem(key);
					} else {
						localStorage.setItem(key, this[key]);
					}
				});
				this.update_user_info();
			});
		},
		update_user_info() {
			if (this.idToken) {
				let decodedIdTokenPayload = JSON.parse(
					atob(this.idToken.split(".")[1])
				); // decode id token's payload section
				this.display_name = decodedIdTokenPayload["custom:display_name"];
				this.phone_number = decodedIdTokenPayload["phone_number"];
				this.logged_in = true;
			} else {
				this.display_name = null;
				this.phone_number = null;
				this.logged_in = false;
			}
		},
		idToken: null,
		accessToken: null,
		refreshToken: null,
		logged_in: false,
		display_name: null,
		phone_number: null,
		refresh() {
			initiateAuthRefresh({ refreshToken: this.refreshToken }).then(function (
				response
			) {
				let authResult = response.AuthenticationResult;
				Alpine.store("user").accessToken = authResult.AccessToken;
				Alpine.store("user").idToken = authResult.IdToken;
				Alpine.store("user").refreshToken = authResult.RefreshToken;
				Alpine.store("user").update_user_info();
			});
		},
		logout() {
			signOut({ access_token: this.accessToken }).then(
				function (response) {
					console.info("Successfully signed out", response);
				},
				function (error) {
					console.error("Error signing out", error);
				}
			);
			localStorage.removeItem("accessToken");
			localStorage.removeItem("idToken");
			localStorage.removeItem("refreshToken");
			this.accessToken = null;
			this.idToken = null;
			this.refreshToken = null;
			this.update_user_info();
		},
	});
}

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

		if (!Alpine.store("deviceInfo").isMobile || isIOS()) {
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
		// Initialize Alpine and SW
		document.addEventListener("alpine:init", () => {
			initAlpine();
		});
		Alpine.start();
		initServiceWorker(setFileToParse);
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

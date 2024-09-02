import Alpine from "alpinejs";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { displayFile } from "./import_whatsapp.js";
import "./styles/main.css";
import { signOut, initiateAuthRefresh } from "./auth.js";
import { initialiseInstallPrompt } from "./install.js";

import MainMenu from "./MainMenu.jsx";
import StatusBar from "./StatusBar.jsx";

window.Alpine = Alpine;

function isMobileOrTablet() {
	return (
		/iPad|iPhone|iPod|android|Mobile|mini|Fennec|Symbian|Windows Phone|BlackBerry|IEMobile/i.test(
			navigator.userAgent
		) ||
		(window.innerWidth <= 1024 &&
			("ontouchstart" in window || navigator.maxTouchPoints > 0))
	);
}
function initAlpine() {
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

function initServiceWorker() {
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
		if (Alpine.store("deviceInfo").isMobile) initialiseInstallPrompt(); // don't run install prompt on desktop

		var bestOnAndroidMsg =
			"Kapta works best on Android mobile devices. Please visit this page on an Android mobile device to use the app.";
		// will need to get a translation done for this
		if (
			!Alpine.store("deviceInfo").isMobile ||
			navigator.userAgent.match(/iPhone/i) ||
			navigator.userAgent.match(/iPad/i)
		) {
			window.addEventListener("load", function () {
				alert(bestOnAndroidMsg);
			});
		}
	}

	navigator.serviceWorker.addEventListener("message", (event) => {
		if (event.data.action !== "load-map") return;
		displayFile(event.data.file);
	});

	navigator.serviceWorker.controller?.postMessage("share-ready");
}

export const removeOptionsMenu = () => {
	setIsVisible(false); // This will "remove" the component by not rendering it
	// might not need this
};

function App() {
	useEffect(() => {
		// Initialize Alpine and SW
		document.addEventListener("alpine:init", () => {
			initAlpine();
		});
		Alpine.start();
		initServiceWorker();
	}, []); // Empty dependency array ensures this effect runs once on mount

	const [isMenuVisible, setIsMenuVisible] = useState(true);

	// set status bar visibility based on if cognito in config
	const [isSBVisible, setIsSBVisible] = useState(false);
	useEffect(() => {
		const hasCognito = Alpine.store("appData")?.hasCognito;
		setIsSBVisible(hasCognito);
	});

	const toggleMenu = () => setIsMenuVisible((prev) => !prev); // might want to split this out to be more precise

	return (
		<div>
			{/* <SomeOtherComponent toggleMenu={toggleMenu} /> */}
			<StatusBar isVisible={isSBVisible} />
			<MainMenu isVisible={isMenuVisible} />
		</div>
	);
}

const rootElement = document.getElementById("main");
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);

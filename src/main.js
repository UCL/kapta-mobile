import Alpine from "alpinejs";
import { displayOptionsMenu, removeOptionsMenu } from "./menu.js";
import { displayFile } from "./import_whatsapp.js";
import "./styles/main.css";
import { signOut, initiateAuthRefresh } from "./auth.js";
import { initialiseInstallPrompt } from "./install.js";

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

document.addEventListener("alpine:init", () => {
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
				// On change, store new tokens in local storage
				["idToken", "accessToken", "refreshToken"].forEach((key) => {
					if (this[key] === null) {
						localStorage.removeItem(key);
					} else {
						localStorage.setItem(key, this[key]);
					}
				});
				// Update display name and phone number
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
});
Alpine.start();

displayOptionsMenu();

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
	if (
		!Alpine.store("deviceInfo").isMobile ||
		navigator.userAgent.match(/iPhone/i) ||
		navigator.userAgent.match(/iPad/i)
	) {
		// to show an alert to users who are not on mobile or are on iPhone
		window.addEventListener("load", function () {
			alert(bestOnAndroidMsg);
		});
	}
}

navigator.serviceWorker.addEventListener("message", (event) => {
	if (event.data.action !== "load-map") return;
	displayFile(event.data.file);
});

navigator.serviceWorker.controller.postMessage("share-ready");

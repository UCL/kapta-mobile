import Alpine from "alpinejs";
import { displayOptionsMenu, removeOptionsMenu } from "./menu.js";
import { displayFile } from "./import_whatsapp.js";
import "./styles/main.css";
import { signOut, initiateAuthRefresh } from "./auth.js";
import { initialiseInstallPrompt } from "./install.js";

window.Alpine = Alpine;

function isMobileOrTablet() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Check for iOS devices
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        return true;
    }

    // Check for Android devices
    if (/android/i.test(userAgent)) {
        return true;
    }

    // Check for other mobile devices
    if (/Mobile|mini|Fennec|Symbian|Windows Phone|BlackBerry/i.test(userAgent)) {
        return true;
    }

    return false;
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
				console.log("SW registered: ", registration);
			})
			.catch((registrationError) => {
				console.log("SW registration failed: ", registrationError);
			});
	});
  
  initialiseInstallPrompt();
}

navigator.serviceWorker.addEventListener("message", (event) => {
	if (event.data.action !== "load-map") return;
	displayFile(event.data.file);
});

navigator.serviceWorker.controller.postMessage("share-ready");

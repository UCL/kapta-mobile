import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import KaptaLogo from "./images/icons/kapta-green.svg";
import { isIOS, isMobileOrTablet } from "./main";
import ReactGA from "react-ga4";

export default function InstallDialog() {
	if (!isMobileOrTablet() || isIOS()) return null; // don't run install prompt on desktop

	const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
	if (isStandalone) return null; // don't run install prompt if already installed

	const { t } = useTranslation();
	const [installPrompt, setInstallPrompt] = useState(null);
	const [isVisible, setIsVisible] = useState(true);

	useEffect(() => {
		const handleBeforeInstallPrompt = (e) => {
			e.preventDefault(); // Prevent the mini-infobar from appearing on mobile
			setInstallPrompt(e);
		};

		window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

		return () => {
			window.removeEventListener(
				"beforeinstallprompt",
				handleBeforeInstallPrompt
			);
		};
	}, []);

	const handleInstallClick = async () => {
		ReactGA.event({
			category: "Install",
			action: "Install Clicked",
		});
		if (!installPrompt) return;
		const result = await installPrompt.prompt();
		// if (result.outcome === "dismissed") {
		// 	setIsVisible(false);
		// } else {
		// 	setTimeout(() => {
		// 		setIsVisible(false);
		// 	}, 3000);
		// }
		if (result) {
			setIsVisible(false);
			setInstallPrompt(null);
		}
	};

	const handleCloseClick = () => {
		setIsVisible(false);
		setInstallPrompt(null);
	};

	if (!isVisible) return null;

	return (
		<dialog id="install-dialog">
			<img src={KaptaLogo}></img>
			<div>{t("installPrompt")}</div>
			<button onClick={handleCloseClick}>{t("dismiss")}</button>
			<button onClick={handleInstallClick}>{t("install")}</button>
		</dialog>
	);
}

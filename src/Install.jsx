import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import KaptaLogo from "./images/icons/kapta-white.png";
import { isMobileOrTablet } from "./main";

export default function InstallDialog() {
	if (!isMobileOrTablet()) return null; // don't run install prompt on desktop

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
		if (!installPrompt) return;
		console.log("install clicked");
		const result = await installPrompt.prompt();
		console.log(result);
		if (result.outcome === "dismissed") {
			setIsVisible(false);
		} else {
			setTimeout(() => {
				setIsVisible(false);
			}, 5000);
		}
		setInstallPrompt(null);
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

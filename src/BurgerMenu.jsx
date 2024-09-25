import React, { useState, useEffect } from "react";
import Alpine from "alpinejs";
import { useTranslation } from "react-i18next";
import StatusBar from "./StatusBar.jsx";
import "./styles/burger-menu.css";
import { exitButtonIcon } from "./icons.js";

const hasCognito = Alpine.store("appData")?.hasCognito;

export default function BurgerMenu({ isVisible, setIsVisible }) {
	// if (!isVisible) return null;

	const [isSBVisible, setIsSBVisible] = useState(false);
	const { t } = useTranslation();

	// set status bar visibility based on if cognito in config, doedn't need to be updated after init
	useEffect(() => {
		setIsSBVisible(hasCognito);
	}, []);

	// if menu not visible, nor should status bar be
	useEffect(() => {
		if (!isVisible) setIsSBVisible(false);
	}, [isVisible]);

	return (
		<div
			id="burger-menu"
			className={`drawer ${isVisible ? "drawer--open" : "drawer--closed"}`}
		>
			<button onClick={() => setIsVisible(false)} className="btn--close-bm">
				{exitButtonIcon}
			</button>
			<StatusBar isVisible={isSBVisible} />
			<details className="bm-item">
				<summary>{t("about")}</summary>
				<div dangerouslySetInnerHTML={{ __html: t("aboutContent") }}></div>
			</details>
			<details className="bm-item">
				<summary>{t("people")}</summary>
				<div dangerouslySetInnerHTML={{ __html: t("peopleContent") }}></div>
			</details>
		</div>
	);
}

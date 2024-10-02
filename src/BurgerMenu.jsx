import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import StatusBar from "./StatusBar.jsx";
import "./styles/burger-menu.css";
import { exitButtonIcon } from "./icons.js";
import { hasCognito } from "./main.js";

export default function BurgerMenu({
	isVisible,
	setIsVisible,
	setIsDialogVisible,
}) {
	const { t } = useTranslation();

	return (
		<div
			id="burger-menu"
			className={`${isVisible ? "drawer--open" : "drawer--closed"}`}
		>
			<button onClick={() => setIsVisible(false)} className="btn--close-bm">
				{exitButtonIcon}
			</button>
			<StatusBar
				setIsSideMenuVisible={setIsVisible}
				setIsDialogVisible={setIsDialogVisible}
			/>
			<details className="bm-item">
				<summary>{t("about")}</summary>
				<div
					className="bm-item__content"
					dangerouslySetInnerHTML={{ __html: t("aboutContent") }}
				></div>
			</details>
			<details className="bm-item">
				<summary>{t("people")}</summary>
				<div
					className="bm-item__content"
					dangerouslySetInnerHTML={{ __html: t("peopleContent") }}
				></div>
			</details>
		</div>
	);
}

import React from "react";
import { useTranslation } from "react-i18next";
import StatusBar from "./StatusBar.jsx";
import "./styles/burger-menu.css";
import { exitButtonIcon, GHIcon } from "./icons.js";

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
			<div className="bm-item bm-links">
				<a
					href="https://github.com/UCL/kapta-mobile"
					id="gh"
					className="bm-item__content"
				>
					{GHIcon}
				</a>
				<a
					href="https://github.com/UCL/kapta-mobile?tab=readme-ov-file#legal-disclaimer"
					id="disclaimer"
					className="bm-item__content"
				>
					{t("legalDisclaimer")}
				</a>
			</div>
		</div>
	);
}

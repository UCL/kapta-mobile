import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import StatusBar from "./StatusBar.jsx";
import "./styles/burger-menu.css";
import { chevronDown, exitButtonIcon, GHIcon } from "./icons.js";
import { useClickOutside } from "./utils.js";

export default function BurgerMenu({
	isVisible,
	setIsVisible,
	setIsLoginVisible,
	setIsWelcomeVisible,
}) {
	const [openSection, setOpenSection] = useState(null);
	const burgerRef = useRef(null);

	const toggleSection = (sectionId) => {
		setOpenSection((prevOpenSection) =>
			prevOpenSection === sectionId ? null : sectionId
		);
	};

	const { t } = useTranslation();
	useClickOutside(burgerRef, () => setIsVisible(false));

	return (
		<div
			id="burger-menu"
			className={`${isVisible ? "drawer--open" : "drawer--closed"}`}
			ref={burgerRef}
		>
			<button onClick={() => setIsVisible(false)} className="btn--close-bm">
				{exitButtonIcon}
			</button>
			<StatusBar
				setIsSideMenuVisible={setIsVisible}
				setIsLoginVisible={setIsLoginVisible}
				setIsWelcomeVisible={setIsWelcomeVisible}
			/>
			<div className="bm__content">
				<div>
					<div className="bm__item">
						<div
							className="bm__item__summary"
							onClick={() => toggleSection("about")}
						>
							{chevronDown} {t("about")}
						</div>
						<div
							className={`bm__item__content ${
								openSection === "about" ? "bm__item__content--open" : ""
							}`}
							dangerouslySetInnerHTML={{ __html: t("aboutContent") }}
						></div>
					</div>
					<div className="bm__item">
						<div
							className="bm__item__summary"
							onClick={() => toggleSection("why")}
						>
							{chevronDown}
							{t("why")}
						</div>
						<div
							className={`bm__item__content ${
								openSection === "why" ? "bm__item__content--open" : ""
							}`}
							dangerouslySetInnerHTML={{ __html: t("whyContent") }}
						></div>
					</div>
					<div className="bm__item">
						<div
							className="bm__item__summary"
							onClick={() => toggleSection("what")}
						>
							{chevronDown}
							{t("what")}
						</div>
						<div
							className={`bm__item__content ${
								openSection === "what" ? "bm__item__content--open" : ""
							}`}
							dangerouslySetInnerHTML={{ __html: t("whatContent") }}
						></div>
					</div>
					<div className="bm__item">
						<div
							className="bm__item__summary"
							onClick={() => toggleSection("people")}
						>
							{chevronDown} {t("people")}
						</div>
						<div
							className={`bm__item__content ${
								openSection === "people" ? "bm__item__content--open" : ""
							}`}
							dangerouslySetInnerHTML={{ __html: t("peopleContent") }}
						></div>
					</div>
				</div>
				<div className="links-disclaimer__wrapper">
					<div className="bm__item">
						<a
							href="https://github.com/UCL/kapta-mobile"
							id="gh"
							className="bm__item__content"
						>
							{GHIcon}
						</a>
					</div>
					<p
						className="bm__item"
						id="disclaimer"
						dangerouslySetInnerHTML={{ __html: t("legalDisclaimer") }}
					></p>
				</div>
			</div>
		</div>
	);
}

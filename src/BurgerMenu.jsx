import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import StatusBar from "./StatusBar.jsx";
import "./styles/burger-menu.css";
import { exitButtonIcon, GHIcon } from "./icons.js";

export default function BurgerMenu({
	isVisible,
	setIsVisible,
	setIsLoginVisible,
	setIsWelcomeVisible,
}) {
	const [openSection, setOpenSection] = useState(null);

	const toggleSection = (sectionId) => {
		setOpenSection((prevOpenSection) => {
			if (prevOpenSection === sectionId) {
				return null; // Close the section if it's already open
			} else {
				return sectionId; // Open the new section, which automatically closes others
			}
		});
	};
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
				setIsLoginVisible={setIsLoginVisible}
				setIsWelcomeVisible={setIsWelcomeVisible}
			/>
			<div className="bm__content">
				<div>
					<details className="bm__item" open={openSection === "about"}>
						<summary onClick={() => toggleSection("about")}>
							{t("about")}
						</summary>
						<div
							className="bm__item__content"
							dangerouslySetInnerHTML={{ __html: t("aboutContent") }}
						></div>
					</details>
					<details className="bm__item" open={openSection === "why"}>
						<summary onClick={() => toggleSection("why")}>Why Kapta</summary>
						<div
							className="bm__item__content"
							dangerouslySetInnerHTML={{ __html: t("aboutContent") }}
						></div>
					</details>
					<details className="bm__item" open={openSection === "what"}>
						<summary onClick={() => toggleSection("what")}>
							What's Next?
						</summary>
						<div
							className="bm__item__content"
							dangerouslySetInnerHTML={{ __html: t("aboutContent") }}
						></div>
					</details>
					<details className="bm__item" open={openSection === "people"}>
						<summary onClick={() => toggleSection("people")}>
							{t("people")}
						</summary>
						<div
							className="bm__item__content"
							dangerouslySetInnerHTML={{ __html: t("peopleContent") }}
						></div>
					</details>
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
					<p className="bm__item" id="disclaimer">
						Disclaimer: The Kapta team has made every effort to develop an app
						that enables users to create WhatsApp Maps with the highest possible
						accuracy. However, we cannot accept responsibility for any errors,
						omissions, or inconsistencies that may occur. If you encounter any
						issues or have feedback, please reach out to us at{" "}
						<a href="mailto:geog.excites@ucl.ac.uk?subject=Kapta Mobile Feedback">
							geog.excites@ucl.ac.uk
						</a>{" "}
						or via <a href="ASK_URL">WhatsApp</a> at +34 678380944.
					</p>
				</div>
			</div>
		</div>
	);
}

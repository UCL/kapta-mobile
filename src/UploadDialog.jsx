import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { submitData } from "./data_submission.js";
import "./styles/map-etc.css";
import html2canvas from "html2canvas";
import { addMetaIcn } from "./icons";
import { useUserStore } from "./useUserStore.js";
import { ASK_URL, hasCognito } from "../globals.js";

export function UploadDialog({ isOpen, setIsOpen }) {
	if (!isOpen) return null;
	console.log("upload dialog open");
	const { t } = useTranslation();
	const [isChecked, setIsChecked] = useState(false);

	const handleSubmit = (e) => {
		e.preventDefault();
		if (isChecked == true) {
			resolve(true);
		} else {
			reject("Permission not given");
		}
		let idToken = user.idToken;
		submitData(currentDataset.geoJSON, idToken);
		(rejectReason) => {
			console.error(rejectReason);
		};
		setIsOpen(false);
	};
	return (
		<dialog id="upload-dialog" open>
			<form className="upload-form" onSubmit={handleSubmit}>
				<h3>Upload data to Kapta</h3>
				<small>
					{t("addMetadataTitle")} {addMetaIcn}
				</small>

				<label for="input-topic">{t("inputtopiclabel")}</label>
				<textarea name="input-topic" id="input-topic"></textarea>

				<label for="input-goal">{t("inputgoallabel")}</label>
				<textarea name="input-goal" id="input-goal"></textarea>
				<label for="data-sov">{t("datasovmessage")}</label>
				<label for="data-sov" class="toggle">
					<input
						type="checkbox"
						id="data-sov"
						name="data-sov"
						class="toggle-input"
						checked={isChecked}
						onChange={(e) => setIsChecked(e.target.checked)}
					/>
					<span
						class="toggle-label"
						data-on={t("yes")}
						data-off={t("no")}
					></span>
					<span class="toggle-handle"></span>
				</label>
				<div className="btn-area">
					<button className="cancel btn" onClick={() => setIsOpen(false)}>
						{t("cancel")}
					</button>
					<button type="submit" className="confirm btn" disabled={!isChecked}>
						{t("confirm")}
					</button>
				</div>
			</form>
		</dialog>
	);
}

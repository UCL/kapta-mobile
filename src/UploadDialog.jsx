import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getTaskDetails, submitData } from "./data_submission.js";
import "./styles/map-etc.css";
import { addMetaIcn } from "./icons";
import { useUserStore } from "./UserContext.js";
import { ASK_URL, hasCognito } from "../globals.js";
import { LoginDialog, WelcomeBackDialog } from "./login.js";

export function UploadDialog({ isOpen, setIsOpen }) {
	if (!isOpen) return null;
	const user = useUserStore();
	const hasDetails = user.checkForDetails();

	const { t } = useTranslation();
	const [isChecked, setIsChecked] = useState(false);
	const [isLoginVisible, setIsLoginVisible] = useState(false);
	const [isWelcomeVisible, setIsWelcomeVisible] = useState(false);
	const [taskId, setTaskId] = useState(null);

	const checkCode = (e) => {
		e.preventDefault();
		var formData = new FormData(e.target);
		const code = formData.get("c-code");
		return getTaskDetails(code).then((response) => console.log(response));
	};
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

	if (hasDetails) {
		useEffect(() => {
			setIsWelcomeVisible(true);
		}, [hasDetails]);
	}
	return (
		<>
			{!user.loggedIn && !hasDetails && (
				<LoginDialog
					isDialogVisible={true}
					setIsDialogVisible={setIsLoginVisible}
					setIsWelcomeVisible={false}
				/>
			)}
			<WelcomeBackDialog
				isVisible={isWelcomeVisible}
				setIsVisible={setIsWelcomeVisible}
			/>
			{user.loggedIn && (
				<>
					<dialog id="upload-dialog" open>
						{!taskId && (
							<form onSubmit={checkCode}>
								<label>
									Please enter the <strong>campaign code</strong> for the task
									you'd like to contribute to if you have one.<br></br>
									If you want to upload your data as <strong>open data</strong>,
									type 'opendata' in the box below.{" "}
									<a>
										Click here to learn more about <strong>open data</strong> in
										Kapta
									</a>
									<input type="text" name="c-code"></input>
								</label>
								<button type="submit">Check campaign code</button>
							</form>
						)}
						{taskId && (
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
									<button
										className="cancel btn"
										onClick={() => setIsOpen(false)}
									>
										{t("cancel")}
									</button>
									<button
										type="submit"
										className="confirm btn"
										disabled={!isChecked}
									>
										{t("confirm")}
									</button>
								</div>
							</form>
						)}
					</dialog>
				</>
			)}
		</>
	);
}

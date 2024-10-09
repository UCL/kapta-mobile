import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { getTaskDetails, submitData } from "./data_submission.js";
import "./styles/main.css";
import { addMetaIcn, nextIcn } from "./icons";
import { useUserStore } from "./UserContext.js";
import { LoginDialog, WelcomeBackDialog } from "./login.js";

export function UploadDialog({ isOpen, setIsOpen }) {
	if (!isOpen) return null;
	const user = useUserStore();
	const hasDetails = user.checkForDetails();

	const { t } = useTranslation();
	const [isChecked, setIsChecked] = useState(false);
	const [isLoginVisible, setIsLoginVisible] = useState(false);
	const [isWelcomeVisible, setIsWelcomeVisible] = useState(false);
	const [task, setTask] = useState(null);

	const checkCode = (e) => {
		e.preventDefault();
		var formData = new FormData(e.target);
		const code = formData.get("c-code");
		return getTaskDetails(code).then((response) => {
			response = response[0];
			const task = {
				id: response.task_id.S,
				description: response.task_description.S,
				title: response.task_title.S,
			};
			return setTask(task);
		});
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
						{!task && (
							<>
								<form onSubmit={checkCode}>
									<label>
										Please enter the <strong>campaign code</strong> for the task
										you'd like to contribute to if you have one.<br></br>
										<input type="text" name="c-code"></input>
									</label>
									<button type="submit" className="btn">
										{nextIcn}
									</button>
								</form>
								<form onSubmit={checkCode}>
									<p>
										If you want to upload your data as{" "}
										<strong>open data</strong>, click the button below.{" "}
									</p>
									<small>
										<a>
											Click here to learn more about <strong>open data</strong>{" "}
											in Kapta
										</a>
									</small>
									<br></br>
									<input
										hidden
										type="text"
										name="c-code"
										defaultValue="opendata"
									></input>
									<button type="submit" className="btn">
										Share for public use
									</button>
								</form>
							</>
						)}
						{task && task.id === "opendata" && (
							<form className="upload-form" onSubmit={handleSubmit}>
								<h3>Upload data to Kapta</h3>
								<small>
									{t("addMetadataTitle")} {addMetaIcn}
								</small>

								<label for="task-topic">{t("inputtopiclabel")}</label>
								<textarea name="task-topic" id="task-topic"></textarea>

								<label for="task-description">{t("inputgoallabel")}</label>
								<textarea
									name="task-description"
									id="task-description"
								></textarea>
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
						{task && task.id !== "opendata" && (
							<form className="upload-form" onSubmit={handleSubmit}>
								<h3>Upload data to Kapta</h3>

								<h3 name="task-topic" id="task-topic">
									{task.title}
								</h3>

								<p name="task-description" id="task-description">
									{task.description}
								</p>

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

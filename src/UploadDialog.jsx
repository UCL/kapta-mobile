import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { createTask, getTaskDetails, submitData } from "./data_submission.js";
import "./styles/main.css";
import { addMetaIcn, nextIcn } from "./icons";
import { useUserStore } from "./UserContext.js";
import { LoginDialog, WelcomeBackDialog } from "./login.js";

const opendataCode = "OPENDATA";
const opendataId = opendataCode.toLowerCase();
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
				id: response.task_id?.S,
				description: response.task_description?.S,
				title: response.task_title?.S,
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
	const handleODSubmit = (e) => {
		e.preventDefault();
		if (isChecked == true) {
			resolve(true);
		} else {
			reject("Permission not given");
		}
		console.log(user);
		let idToken = user.idToken;
		// create a new task and then submit the data
		var formData = new FormData(e.target);
		const campaign_code = opendataCode;
		const data = {
			campaignCode: campaign_code,
			title: formData.get("title"),
			description: formData.get("description"),
			createdBy: user.id,
			organisation: "opendata",
			private: false,
			visible: true,
			task_id: user.id,
		};
		createTask(data).then((response) => {
			console.log("create task response", response);
		});

		submitData(currentDataset.geoJSON, idToken);
		(rejectReason) => {
			console.error(rejectReason);
		};
		setIsOpen(false);
	};

	if (hasDetails && !user.loggedIn) {
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
				version="r"
			/>
			{user.loggedIn && (
				<>
					{/* check the code or choose open data */}
					<dialog id="upload-dialog" open>
						{!task && (
							<>
								<form onSubmit={checkCode}>
									<label>
										Please enter the <strong>campaign code</strong> for the task
										you'd like to contribute to if you have one.<br></br>
										<input
											type="text"
											name="c-code"
											className="code-input"
										></input>
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
										defaultValue={opendataCode}
									></input>
									<button type="submit" className="btn">
										Share for public use
									</button>
								</form>
							</>
						)}
						{/* opendata request - will also create a new task */}
						{task && task.id === opendataId && (
							<form className="upload-form" onSubmit={handleODSubmit}>
								<h3>Upload data to Kapta</h3>
								<small>
									{t("addMetadataTitle")} {addMetaIcn}
								</small>

								<label htmlFor="task-title">{t("inputtopiclabel")}</label>
								<textarea name="task-title" id="task-title"></textarea>

								<label htmlFor="task-description">{t("inputgoallabel")}</label>
								<textarea
									name="task-description"
									id="task-description"
								></textarea>
								<label htmlFor="data-sov">{t("datasovmessage")}</label>
								<label htmlFor="data-sov" className="toggle">
									<input
										type="checkbox"
										id="data-sov"
										name="data-sov"
										className="toggle-input"
										checked={isChecked}
										onChange={(e) => setIsChecked(e.target.checked)}
									/>
									<span
										className="toggle-label"
										data-on={t("yes")}
										data-off={t("no")}
									></span>
									<span className="toggle-handle"></span>
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
						{/* if they have a campaign code */}
						{task && task.id !== opendataId && (
							<form className="upload-form" onSubmit={handleSubmit}>
								<h3>Upload data to Kapta</h3>
								<h3>Task Details</h3>
								<h3 name="task-title" id="task-title">
									<small>title:</small> {task.title}
								</h3>

								<p>Description:</p>
								<p name="task-description" id="task-description">
									{task.description}
								</p>

								<label htmlFor="data-sov">{t("datasovmessage")}</label>
								<label htmlFor="data-sov" className="toggle">
									<input
										type="checkbox"
										id="data-sov"
										name="data-sov"
										className="toggle-input"
										checked={isChecked}
										onChange={(e) => setIsChecked(e.target.checked)}
									/>
									<span
										className="toggle-label"
										data-on={t("yes")}
										data-off={t("no")}
									></span>
									<span className="toggle-handle"></span>
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

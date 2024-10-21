import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { createTask, getTaskDetails, submitData } from "./data_submission.js";
import "./styles/main.css";
import { addMetaIcn, nextIcn } from "./icons";
import { useUserStore } from "./UserContext.jsx";
import { LoginDialog, WelcomeBackDialog } from "./Login.jsx";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const opendataCode = "OPENDATA";
const opendataId = opendataCode.toLowerCase();
export function UploadDialog({ isOpen, setIsOpen, currentDataset }) {
	if (!isOpen) return null;
	const user = useUserStore();
	const hasDetails = user.checkForDetails();

	const { t } = useTranslation();
	const [isChecked, setIsChecked] = useState(false);
	const [isLoginVisible, setIsLoginVisible] = useState(false);
	const [isWelcomeVisible, setIsWelcomeVisible] = useState(false);
	const [task, setTask] = useState(null);
	const [hasCodeError, setHasCodeError] = useState(false);

	const checkCode = async (e) => {
		e.preventDefault();
		var formData = new FormData(e.target);
		const code = formData.get("c-code");
		return getTaskDetails(code).then((response) => {
			if (!response) {
				console.error("Error: no response received");
				return setHasCodeError(true);
			}
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
		if (!isChecked) {
			// this shouldn't trigger because the button is disabled when not checked
			console.error("Permission not given");
			return;
		} else {
			let idToken = user.idToken;
			console.log(currentDataset, "\n", idToken);
			return submitData(currentDataset, idToken).then((response) => {
				console.log("Data upload success", response);
				if (response) {
					setIsOpen(false);
					// todo: show success modal
				}
			});
		}
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
		// not sure we want to use the whole token since that's rather long
		// create a new task and then submit the data
		var formData = new FormData(e.target);
		const campaign_code = opendataCode;
		const data = {
			campaignCode: campaign_code,
			title: formData.get("title"),
			description: formData.get("description"),
			createdBy: idToken,
			organisation: "opendata",
			private: false,
			visible: true,
			task_id: idToken,
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

	const handleInfoClick = (e) => {
		const abbrElem = e.target.closest("abbr");
		return alert(abbrElem.title);
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
								<form onSubmit={checkCode} className="code-form">
									<label>
										If you have a <strong>campaign code</strong>, enter it
										below.<br></br>
										<input
											placeholder="Campaign code"
											type="text"
											name="c-code"
											className="code-input"
										></input>
									</label>
									<button type="submit" className="btn check-code">
										{nextIcn}
									</button>
									{hasCodeError && (
										<small className="code-error">
											Code not valid, check code and try again
										</small>
									)}
								</form>
								<hr></hr>
								{/* opendata button */}
								<form onSubmit={checkCode} className="code-form">
									<p>
										If you want to upload your data as{" "}
										<strong>open data</strong>, click the button below.{" "}
										<abbr
											onClick={handleInfoClick}
											className="opendata-info"
											title="Open Data"
										>
											{" "}
											<FontAwesomeIcon icon={faInfoCircle} />
										</abbr>
									</p>

									<input
										hidden
										type="text"
										name="c-code"
										defaultValue={opendataCode}
									></input>
									<button type="submit" className="btn opendata">
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
								<h4 className="grey">Upload data to Kapta</h4>
								<h2>Task Details</h2>
								<h3 name="task-title" id="task-title">
									<small>Title:</small> {task.title}
								</h3>

								<p name="task-description" id="task-description">
									<span>Description: </span>
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

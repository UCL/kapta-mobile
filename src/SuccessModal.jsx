import React, { useEffect } from "react";
import { closeIcon } from "./icons";

export default function SuccessModal({ isVisible, setIsVisible }) {
	if (!isVisible) return null;
	useEffect(() => {
		let timer = setTimeout(() => {
			try {
				setIsVisible(false);
			} catch (error) {
				console.error("Error hiding the loader:", error);
			}
		}, 4800);

		// Clean up the timer if the component is unmounted or if `isVisible` changes
		return () => clearTimeout(timer);
	}, [isVisible, setIsVisible]);

	return (
		<dialog open={isVisible} id="success-dialog">
			<button className="btn cancel" onClick={() => setIsVisible(false)}>
				{closeIcon}
			</button>
			<h3>Upload Successful</h3>
			<p>Thank you for your contribution!</p>
		</dialog>
	);
}

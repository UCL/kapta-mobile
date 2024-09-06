import React, { useEffect } from "react";
import "./styles/loader.css";

export default function Loader({ isVisible, setIsVisible }) {
	if (!isVisible) return null;

	useEffect(() => {
		let timer = setTimeout(() => {
			try {
				setIsVisible(false);
			} catch (error) {
				console.error("Error hiding the loader:", error);
			}
		}, 2000);

		// Clean up the timer if the component is unmounted or if `isVisible` changes
		return () => clearTimeout(timer);
	}, [isVisible, setIsVisible]);

	return <div id="loader" className="loader"></div>;
}

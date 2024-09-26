import { useState, useEffect, useCallback } from "react";
import { initiateAuthRefresh, signOut } from "./auth";

export const useUserStore = () => {
	const [idToken, setIdToken] = useState(null);
	const [accessToken, setAccessToken] = useState(null);
	const [refreshToken, setRefreshToken] = useState(null);
	const [displayName, setDisplayName] = useState(null);
	const [phoneNumber, setPhoneNumber] = useState(null);
	const [loggedIn, setLoggedIn] = useState(false);

	const updateUserInfo = useCallback(() => {
		if (idToken) {
			try {
				const base64Payload = idToken.split(".")[1]; // Get the payload part
				const decodedIdTokenPayload = JSON.parse(atob(base64Payload));
				setDisplayName(decodedIdTokenPayload["custom:display_name"]);
				setPhoneNumber(decodedIdTokenPayload["phone_number"]);
				setLoggedIn(true);
			} catch (error) {
				console.error("Failed to decode idToken:", error);
				setDisplayName(null);
				setPhoneNumber(null);
				setLoggedIn(false);
			}
		} else {
			// Reset state if idToken is null or empty
			setDisplayName(null);
			setPhoneNumber(null);
			setLoggedIn(false);
		}
	}, [idToken]);

	// Initialize user tokens from localStorage and update user info
	useEffect(() => {
		const storedIdToken = localStorage.getItem("idToken");
		const storedAccessToken = localStorage.getItem("accessToken");
		const storedRefreshToken = localStorage.getItem("refreshToken");

		// Only set state if tokens are not the string "null"
		setIdToken(storedIdToken === "null" ? null : storedIdToken);
		setAccessToken(storedAccessToken === "null" ? null : storedAccessToken);
		setRefreshToken(storedRefreshToken === "null" ? null : storedRefreshToken);

		// Update user info after initializing tokens
		updateUserInfo();
	}, [updateUserInfo]);

	// Sync tokens with localStorage whenever they change
	useEffect(() => {
		localStorage.setItem("idToken", idToken || "null"); // Save as "null" if null
		localStorage.setItem("accessToken", accessToken || "null");
		localStorage.setItem("refreshToken", refreshToken || "null");

		updateUserInfo(); // Update user info whenever tokens change
	}, [idToken, accessToken, refreshToken, updateUserInfo]);

	// Function to refresh tokens
	const refresh = useCallback(() => {
		if (refreshToken) {
			initiateAuthRefresh({ refreshToken }).then((response) => {
				const authResult = response.AuthenticationResult;
				setIdToken(authResult.IdToken);
				setAccessToken(authResult.AccessToken);
				setRefreshToken(authResult.RefreshToken);
			});
		}
	}, [refreshToken]);

	// Function to log out
	const logout = useCallback(() => {
		if (accessToken) {
			signOut({ access_token: accessToken }).then(
				(response) => {
					console.info("Successfully signed out", response);
				},
				(error) => {
					console.error("Error signing out", error);
				}
			);
		}
		// Clear localStorage and state
		localStorage.removeItem("accessToken");
		localStorage.removeItem("idToken");
		localStorage.removeItem("refreshToken");
		setIdToken(null);
		setAccessToken(null);
		setRefreshToken(null);
		setLoggedIn(false);
	}, [accessToken]);

	return {
		idToken,
		accessToken,
		refreshToken,
		displayName,
		phoneNumber,
		loggedIn,
		refresh,
		logout,
	};
};

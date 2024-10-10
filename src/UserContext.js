import React, {
	useState,
	useCallback,
	createContext,
	useContext,
	useEffect,
} from "react";
import { initiateAuthRefresh, signOut } from "./auth";

// Create the User Context
const UserContext = createContext();

// Create a custom hook to use the UserContext
export const useUserStore = () => {
	return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
	const [idToken, setIdToken] = useState(null);
	const [accessToken, setAccessToken] = useState(null);
	const [refreshToken, setRefreshToken] = useState(null);
	const [displayName, setDisplayName] = useState(null);
	const [phoneNumber, setPhoneNumber] = useState(null);
	const [loggedIn, setLoggedIn] = useState(false);

	useEffect(() => {
		checkForDetails();
	}, []); // check for details when component mounts ie app starts

	const setUserDetails = useCallback(
		(userDetails) => {
			const base64Payload = userDetails.idToken.split(".")[1];
			const decodedIdTokenPayload = JSON.parse(atob(base64Payload));
			setDisplayName(decodedIdTokenPayload["custom:display_name"]);
			setPhoneNumber(decodedIdTokenPayload["phone_number"]);

			setAccessToken(userDetails.accessToken);
			setIdToken(userDetails.idToken);
			setRefreshToken(userDetails.refreshToken);
			setLoggedIn(true);

			setLocalStorage(
				userDetails.idToken,
				userDetails.accessToken,
				userDetails.refreshToken
			); // the states won't have been updated in time, so use the original prop
		},
		[idToken]
	);

	// Check for user tokens from localStorage and update user info
	const checkForDetails = useCallback(() => {
		const storedIdToken = localStorage.getItem("idToken");
		const storedAccessToken = localStorage.getItem("accessToken");
		const storedRefreshToken = localStorage.getItem("refreshToken");

		let userDetails = {
			accessToken: storedAccessToken,
			idToken: storedIdToken,
			refreshToken: storedRefreshToken,
		};
		const userDetailsNotNull = Object.values(userDetails).every(
			(value) => value !== null && value !== "null" && value !== undefined
		);

		// Only set user details if tokens exist and are not the string "null"
		if (userDetailsNotNull) {
			setUserDetails(userDetails);
			return true;
		} else return false;
	}, [setUserDetails]);

	// update localStorage values
	const setLocalStorage = (idToken, accessToken, refreshToken) => {
		localStorage.setItem("idToken", idToken || "null"); // Save as "null" if null
		localStorage.setItem("accessToken", accessToken || "null");
		localStorage.setItem("refreshToken", refreshToken || "null");
	};

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

	return (
		<UserContext.Provider
			value={{
				idToken,
				accessToken,
				refreshToken,
				displayName,
				phoneNumber,
				loggedIn,
				refresh,
				logout,
				setUserDetails,
				checkForDetails,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

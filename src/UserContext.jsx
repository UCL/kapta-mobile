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
	const [userId, setUserId] = useState(null);
	const [loggedIn, setLoggedIn] = useState(false);

	useEffect(() => {
		checkForDetails();
	}, []); // check for details when component mounts ie app starts

	const setUserDetails = useCallback(
		(userDetails) => {
			const base64Payload = userDetails.idToken.split(".")[1];
			const decodedIdTokenPayload = JSON.parse(atob(base64Payload));
			setDisplayName(decodedIdTokenPayload["preferred_username"]);
			setPhoneNumber(decodedIdTokenPayload["phone_number"]);
			setUserId(decodedIdTokenPayload["sub"]);

			setAccessToken(userDetails.accessToken);
			setIdToken(userDetails.idToken);
			setRefreshToken(userDetails.refreshToken);
			setLoggedIn(true);
			console.log("userDetails", userDetails);

			setLocalStorage(
				userDetails.idToken,
				userDetails.accessToken,
				userDetails.refreshToken
			); // the states won't have been updated in time, so use the original prop
		},
		[idToken]
	);
	function isTokenValid(token) {
		const base64Payload = token.split(".")[1];
		const decodedToken = JSON.parse(atob(base64Payload));
		const expirationTime = decodedToken.exp;
		const currentTime = Math.floor(Date.now() / 1000);

		return expirationTime > currentTime;
	}

	const getLocalStorageTokens = useCallback(() => {
		console.log("getting tokens from local storage");

		return {
			idToken: localStorage.getItem("KM-idToken"),
			accessToken: localStorage.getItem("KM-accessToken"),
			refreshToken: localStorage.getItem("KM-refreshToken"),
		};
	}, []);

	// Check for user tokens from localStorage and update user info
	const checkForDetails = useCallback(async () => {
		let userDetails = getLocalStorageTokens();
		// check each of the tokens is there and not "null"
		const userDetailsNotNull = Object.values(userDetails).every(
			(value) => value !== null && value !== "null" && value !== undefined
		);

		if (userDetailsNotNull) {
			const isValid = await isTokenValid(userDetails.idToken);
			if (!isValid) {
				await refresh(userDetails.refreshToken);
				try {
					userDetails = getLocalStorageTokens();
					await isTokenValid();
					setUserDetails(userDetails);
				} catch (error) {
					console.error("Error refreshing tokens", error);
				}
			} else {
				setUserDetails(userDetails);
				return true;
			}
		} else return false; // user will have to log in again
	}, [setUserDetails]);

	// update localStorage values
	const setLocalStorage = (idToken, accessToken, refreshToken) => {
		console.log("setting tokens in local storage", refreshToken);
		localStorage.setItem("KM-idToken", idToken || "null"); // Save as "null" if null
		localStorage.setItem("KM-accessToken", accessToken || "null");
		localStorage.setItem("KM-refreshToken", refreshToken || "null");
	};

	// Function to refresh tokens
	const refresh = useCallback(
		async (refreshToken) => {
			const response = await initiateAuthRefresh(refreshToken);
			const authResult = response.AuthenticationResult;
			setUserDetails({
				accessToken: authResult.AccessToken,
				idToken: authResult.IdToken,
				refreshToken: refreshToken,
			});
		},
		[refreshToken, setUserDetails]
	);

	// Function to log out
	const logout = useCallback(() => {
		if (accessToken) {
			signOut(accessToken).then(
				(response) => {
					console.info("Successfully signed out", response);
				},
				(error) => {
					console.error("Error signing out", error);
				}
			);
		}
		// Clear localStorage and state
		localStorage.removeItem("KM-accessToken");
		localStorage.removeItem("KM-idToken");
		localStorage.removeItem("KM-refreshToken");
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
				userId,
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

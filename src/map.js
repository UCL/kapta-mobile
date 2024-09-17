import "leaflet-easybutton";
import "leaflet-easyprint";
import "leaflet/dist/leaflet.css";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState, useRef, useCallback } from "react";
import "./styles/map-etc.css";
import L from "leaflet";
import {
	MapContainer,
	TileLayer,
	Marker,
	Popup,
	CircleMarker,
	useMap,
	ScaleControl,
	AttributionControl,
} from "react-leaflet";

import { MapActionArea, ShareModal } from "./mapOverlays.js";
import {
	basemapDarkIcon,
	basemapSatIcon,
	GPSPositionIcn,
	GPSIcn,
} from "./icons.js";

const config = require("./config.json");

/************************************************************************************************
 *   Basemaps (TileLayers)
 ************************************************************************************************/

function DarkTileLayer() {
	const accessToken = config.mapbox.accessToken; // Make sure config is imported or defined

	return (
		<TileLayer
			url={`https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/{z}/{x}/{y}?access_token=${accessToken}`}
			minZoom={2}
			maxZoom={21}
			maxNativeZoom={21}
			opacity={1}
			subdomains={["mt0", "mt1", "mt2", "mt3"]}
			attribution=" Mapbox | OSM Contributors"
			crossOrigin="anonymous"
		/>
	);
}

function SatelliteTileLayer() {
	const accessToken = config.mapbox.accessToken;

	return (
		<TileLayer
			url={`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/{z}/{x}/{y}?access_token=${accessToken}`}
			minZoom={2}
			maxZoom={21}
			maxNativeZoom={21}
			opacity={1}
			subdomains={["mt0", "mt1", "mt2", "mt3"]}
			attribution=" Mapbox | OSM Contributors"
			crossOrigin="anonymous"
		/>
	);
}

/************************************************************************************************
 * Display Data
 ***********************************************************************************************/
var markerOptions = {
	radius: 5,
	weight: 0,
	opacity: 1,
	fillOpacity: 0.8,
};

function getFriendlyDatetime(datetime) {
	// Convert the datetime string into a more readable form
	return datetime.split("T").join(" ").replaceAll("-", "/");
}
const getImageURLFromZip = async (zip, imgFilename) => {
	try {
		const file = zip.file(
			new RegExp(imgFilename.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") + "$")
		);
		if (!file) {
			console.error(`File not found in ZIP: ${imgFilename}`);
			return null;
		}
		const blob = await file[0].async("blob");
		console.log(`Successfully extracted file: ${imgFilename}`);
		let urlCreator = window.URL || window.webkitURL;
		let url = urlCreator.createObjectURL(blob);
		return url;
	} catch (error) {
		console.error(`Error extracting file ${imgFilename}:`, error);
		return null;
	}
};

function MapDataLayer({ data }) {
	const { t } = useTranslation();
	const map = useMap();
	const boundsRef = useRef([]);
	const { data: geoJSON, imgZip } = data;
	const [featureImages, setFeatureImages] = useState({}); // this is basically a cache

	useEffect(() => {
		// fit map to bounds
		if (boundsRef.current.length > 0) {
			map.fitBounds(boundsRef.current);
		}
	}, [geoJSON, map]);

	const handleMarkerClick = useCallback(
		async (feature) => {
			console.log("feature", feature);
			if (imgZip && feature.properties.imgFilenames.length > 0) {
				// will want to map over imgFilenames when we support multiple
				feature.properties.imgFilenames.map(async (filename) =>
					// check the image isn't already loaded
					{
						console.log("filename", filename);
						if (filename && !featureImages[filename]) {
							const url = await getImageURLFromZip(imgZip, filename);
							setFeatureImages((prev) => ({
								...prev,
								[filename]: url,
							}));
						}
					}
				);
			}
		},
		[imgZip, featureImages]
	);

	return (
		<>
			{geoJSON.features.map((feature, index) => {
				if (feature.geometry?.coordinates) {
					const { coordinates } = feature.geometry;
					const latlng = { lat: coordinates[1], lng: coordinates[0] };

					const observations = feature.properties.observations.replace(
						/<br\s*\/?>/gi,
						"\n"
					);
					boundsRef.current.push([latlng.lat, latlng.lng]);

					const markerColour = feature.properties.markerColour
						? feature.properties.markerColour
						: "red";

					const imgFilenames = feature.properties.imgFilenames;
					return (
						<CircleMarker
							key={index}
							center={latlng}
							pathOptions={{
								color: markerColour,
								fillColor: markerColour,
								...markerOptions,
							}}
							eventHandlers={{
								click: () => handleMarkerClick(feature),
							}}
						>
							<Popup>
								<div className="map-popup-body">
									{imgFilenames && imgFilenames.length > 0 && (
										<div className="feature-images">
											{imgFilenames.map(
												(filename, index) =>
													featureImages[filename] && (
														<img
															key={index}
															src={featureImages[filename]}
															alt={`Feature image ${index + 1}`}
															style={{
																maxWidth: "100%",
																maxHeight: "200px",
																marginBottom: "10px",
															}}
														/>
													)
											)}
										</div>
									)}
									{observations.split("\n").map((o, index) => (
										<p key={index}>{o}</p>
									))}
								</div>
								<div className="map-popup-footer">
									{t("date")}:{" "}
									{getFriendlyDatetime(feature.properties.datetime)}
									<br />
									{t("observer")}: {feature.properties.observer}
								</div>
							</Popup>
						</CircleMarker>
					);
				}
			})}
		</>
	);
}

/************************************************************************************************
 *  Error Popup
 ************************************************************************************************/
function ErrorPopup({ error }) {
	const map = useMap();

	// Adjust the map view to a central location (e.g., coordinates [0, 0])
	useEffect(() => {
		if (error) {
			map.setView([0, 0], map.getZoom(), { animate: true }); // Center the map
		}
	}, [error, map]);

	return error ? (
		<Marker position={[0, 0]}>
			<Popup
				position={[0, 0]} // Position within the map (centered in this case)
				autoClose={false}
			>
				<div>{error}</div>
			</Popup>
		</Marker>
	) : null;
}

/************************************************************************************************
 *  Map
 ************************************************************************************************/

var southWest = L.latLng(-70, -180);
var northEast = L.latLng(80, 180);
const mapConfig = {
	center: [0, 0],
	zoom: 2,
	minZoom: 2,
	maxZoom: 21,
	zoomControl: false,
	attributionControl: false,
	style: { height: "100vh", width: "100%" },
	maxBounds: L.latLngBounds(southWest, northEast),
	preferCanvas: true,
};
const currentPositionIcon = L.divIcon({
	html: GPSPositionIcn,
	className: "position-marker-icon",
	iconSize: [30, 30],
	iconAnchor: [5, 0],
});

function UpdateMap({ currentLocation, flyToLocation, setFlyToLocation }) {
	// this is a functional component, it doesn't render anything
	// hook to fly to current location when updated
	const map = useMap();
	useEffect(() => {
		if (currentLocation && flyToLocation) {
			map.flyTo(currentLocation, map.getZoom());
			setFlyToLocation(false);
		}
	}, [currentLocation, flyToLocation]);

	return null;
}

export function Map({ isVisible, showMenu, data }) {
	if (!isVisible) return null;

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [titleValue, setTitleValue] = useState("");
	const [shouldPulse, setShouldPulse] = useState(false);
	const [isSatelliteLayer, setIsSatelliteLayer] = useState(false);
	const [currentLocation, setCurrentLocation] = useState(null);
	const [flyToLocation, setFlyToLocation] = useState(false);
	const [error, setError] = useState(null);

	// pulse effect on title update
	useEffect(() => {
		if (shouldPulse) {
			const timer = setTimeout(() => {
				setShouldPulse(false);
			}, 6000);
			return () => clearTimeout(timer); // Cleanup to avoid memory leaks
		}
	}, [shouldPulse]);

	const getCurrentPosition = () => {
		const options = {
			enableHighAccuracy: true,
			timeout: 5000,
			maximumAge: 0,
		};
		const success = (pos) => {
			const lat = pos.coords.latitude;
			const lng = pos.coords.longitude;
			setCurrentLocation([lat, lng]);
			setFlyToLocation(true);
		};
		const error = (err) => {
			console.warn(`ERROR(${err.code}): ${err.message}`);
			setError(
				"Unable to retrieve location. Please check your device settings."
			);
		};
		// call the above if the browser supports it
		navigator.geolocation
			? navigator.geolocation.getCurrentPosition(success, error, options)
			: console.error("GPS not available");
	};

	return (
		<>
			<ShareModal
				isOpen={isModalOpen}
				setIsOpen={setIsModalOpen}
				currentDataset={data}
			/>

			<div id="map">
				<div className={`map-title ${shouldPulse ? "pulse-shadow" : ""}`}>
					{titleValue}
				</div>
				<button
					id="base-map--toggle"
					className="map-button"
					onClick={() => setIsSatelliteLayer(!isSatelliteLayer)}
				>
					{isSatelliteLayer ? basemapDarkIcon : basemapSatIcon}
				</button>
				<button id="gps" className="map-button" onClick={getCurrentPosition}>
					{GPSIcn}
				</button>
				<MapContainer {...mapConfig}>
					{/* determine which basemap we show */}
					{isSatelliteLayer ? <SatelliteTileLayer /> : <DarkTileLayer />}
					{/* current position marker */}
					{currentLocation && (
						<Marker position={currentLocation} icon={currentPositionIcon}>
							<Popup>
								<p style={{ textAlign: "center", fontWeight: 600 }}>
									You're here!
								</p>
								<p style={{ textAlign: "center" }}>
									{currentLocation.join(", ")}
								</p>
							</Popup>
						</Marker>
					)}
					{/* error if currentLocation can't be found */}
					{error && <ErrorPopup />}
					{data && <MapDataLayer data={data} />}
					<UpdateMap
						currentLocation={currentLocation}
						flyToLocation={flyToLocation}
						setFlyToLocation={setFlyToLocation}
					/>
					<ScaleControl position="bottomleft" metric={true} imperial={false} />
					<AttributionControl
						position="bottomright"
						prefix="Leaflet"
						attribution="Mapbox | OSM Contributors"
					/>
				</MapContainer>
				<MapActionArea
					setTitle={setTitleValue}
					setPulse={setShouldPulse}
					showMenu={showMenu}
					setModalOpen={setIsModalOpen}
				/>
			</div>
		</>
	);
}

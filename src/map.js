import "leaflet-easybutton";
import "leaflet-easyprint";
import "leaflet/dist/leaflet.css";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState, useRef } from "react";
import "./styles/map-etc.css";
import L from "leaflet";
import * as JSZip from "jszip";
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
const getImageFromZip = async (zip, imgFilename) => {
	// TODO: do we need to give it ios/android formats?
	try {
		console.log(`Attempting to extract file: ${imgFilename}`);
		const file = zip.file(imgFilename);
		if (!file) {
			console.error(`File not found in ZIP: ${imgFilename}`);
			return null;
		}
		const blob = await file.async("blob");
		console.log(`Successfully extracted file: ${imgFilename}`);
		return {
			filename: imgFilename,
			blob: blob,
		};
	} catch (error) {
		console.error(`Error extracting file ${imgFilename}:`, error);
		return null;
	}
};

function MapDataLayer({ data, imgData = null }) {
	const { t } = useTranslation();
	const map = useMap();
	const boundsRef = useRef([]);
	const { imgZip, imgFilenames } = imgData;

	useEffect(() => {
		if (boundsRef.current.length > 0) {
			map.fitBounds(boundsRef.current);
		}
	}, [data, map]);

	useEffect(() => {
		// Load ZIP file when component mounts - unsure if we should do this here
		const loadZip = async () => {
			const zip = new JSZip();
			try {
				await zip.loadAsync(mapdata);
			} catch (error) {
				console.error("Error loading ZIP file:", error);
			}
		};
		loadZip();
	}, [imgData]);

	const [selectedFeature, setSelectedFeature] = useState(null);
	const [imageUrl, setImageUrl] = useState(null);

	const handleMarkerClick = async (feature) => {
		// set the selected feature and set the image url, it will rerender due to state change
		setSelectedFeature(feature);
		if (zip && feature.properties.imgFilename) {
			const url = await getImageFromZip(zip, feature.properties.imgFilename);
			setImageUrl(url);
		}
	};
	return (
		<>
			{mapdata.features.map((feature, index) => {
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
							{selectedFeature === feature && (
								<Popup>
									<div className="map-popup-body">
										{imageUrl && (
											<img
												src={imageUrl}
												alt="Feature image"
												style={{ maxWidth: "100%", maxHeight: "200px" }}
											/>
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
							)}
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

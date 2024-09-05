import "leaflet-easybutton";
import "leaflet-easyprint";
import "leaflet/dist/leaflet.css";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState, useRef } from "react";
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
var geojsonMarkerOptions = {
	radius: 5,
	fillColor: "red",
	color: "red",
	weight: 0,
	opacity: 1,
	fillOpacity: 0.8,
};

function getFriendlyDatetime(datetime) {
	// Convert the datetime string into a more readable form
	return datetime.split("T").join(" ").replaceAll("-", "/");
}

function MapDataLayer({ data }) {
	const { t } = useTranslation();
	const map = useMap();
	const boundsRef = useRef([]);

	useEffect(() => {
		if (boundsRef.current.length > 0) {
			map.fitBounds(boundsRef.current);
		}
	}, [data, map]);
	return (
		<>
			{data.features.map((feature, index) => {
				if (feature.geometry?.coordinates) {
					const { coordinates } = feature.geometry;
					const latlng = { lat: coordinates[1], lng: coordinates[0] };

					const observations = feature.properties.observations.replace(
						/<br\s*\/?>/gi,
						"\n"
					);
					boundsRef.current.push([latlng.lat, latlng.lng]);

					return (
						<CircleMarker
							key={index}
							center={latlng}
							pathOptions={geojsonMarkerOptions}
						>
							<Popup>
								<div className="map-popup-body">
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
 * Share image
 ************************************************************************************************/
var printBtn = L.easyPrint({
	hidden: true,
	sizeModes: ["A4Portrait"],
});

/************************************************************************************************
 *  Display Map
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

export function Map({ isVisible, showMenu, data }) {
	if (!isVisible) return null;

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [titleValue, setTitleValue] = useState("");
	const [shouldPulse, setShouldPulse] = useState(false);
	const [isSatelliteLayer, setIsSatelliteLayer] = useState(false);
	const [currentLocation, setCurrentLocation] = useState(null);
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
		function success(pos) {
			const lat = pos.coords.latitude;
			const lng = pos.coords.longitude;
			setCurrentLocation([lat, lng]);
		}
		function error(err) {
			console.warn(`ERROR(${err.code}): ${err.message}`);
			setError(
				"Unable to retrieve location. Please check your device settings."
			);
		}

		navigator.geolocation
			? navigator.geolocation.getCurrentPosition(success, error, options)
			: console.error("GPS not available");
	};

	const UpdateMap = () => {
		// hook to fly to current location when updated
		const map = useMap();
		if (currentLocation) {
			map.flyTo(currentLocation, map.getZoom());
		}
		return null;
	};
	var southWest = L.latLng(-70, -180);
	var northEast = L.latLng(80, 180);
	const mapConfig = {
		center: [0, 0],
		zoom: 2,
		minZoom: 2,
		maxZoom: 21,
		zoomControl: false,
		attributionControl: true,
		style: { height: "100vh", width: "100%" },
		maxBounds: L.latLngBounds(southWest, northEast),
	};

	return (
		<>
			<ShareModal isOpen={isModalOpen} />
			<div className={`map-title ${shouldPulse ? "pulse-shadow" : ""}`}>
				{titleValue}
			</div>
			<div id="map">
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
						<Marker position={currentLocation}>
							<Popup>{GPSPositionIcn}</Popup>
						</Marker>
					)}
					{/* error if currentLocation can't be found */}
					{error && <ErrorPopup />}
					{data && <MapDataLayer data={data} />}
					<UpdateMap />
					<ScaleControl position="bottomleft" />
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

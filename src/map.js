import "leaflet-easybutton";
import "leaflet-easyprint";
import "leaflet/dist/leaflet.css";
import { i18next } from "./languages.js";

import { displayOptionsMenu } from "./menu.js";

import { buildActionTray, closeModal } from "./mapOverlays.js";
import {
	basemapDarkIcon,
	basemapSatIcon,
	GPSPositionIcn,
	GPSIcn,
} from "./icons.js";

const config = require("./config.json");

var scaleLine;
var attributionContainer;
var currentLocation;

/************************************************************************************************
 *   Basemaps
 ************************************************************************************************/

var basemapDark = L.tileLayer(
	`https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/{z}/{x}/{y}?access_token={accessToken}`,
	{
		minZoom: 2,
		maxZoom: 21,
		maxNativeZoom: 21,
		opacity: 1,
		savetileend: false,
		cache: false,
		subdomains: ["mt0", "mt1", "mt2", "mt3"],
		attribution: "Leaflet | Mapbox | OSM Contributors",
		accessToken: config.mapbox.accessToken,
	}
);

var basemapSat = L.tileLayer(
	`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/{z}/{x}/{y}?access_token={accessToken}`,
	{
		minZoom: 2,
		maxZoom: 21,
		maxNativeZoom: 21,
		opacity: 1,
		// savetileend:true,
		// cache:false,
		// border: 'solid black 5px',
		subdomains: ["mt0", "mt1", "mt2", "mt3"],
		attribution: "Leaflet | Mapbox | OSM Contributors",
		accessToken: config.mapbox.accessToken,
	}
);

var baseMaps = {
	Satellite: basemapSat,
	Dark: basemapDark,
};

var basemapButton = L.easyButton({
	id: "baseMapToggle",
	class: "easyButton",
	position: "topleft",
	states: [
		{
			stateName: "dark",
			title: "Display Satellite Layer",
			icon: `<span>${basemapSatIcon}</span>`,
			onClick: function (control) {
				control.button.classList.add("btn");
				// Switch to basemapSat
				basemapDark.removeFrom(control._map);
				basemapSat.addTo(control._map);
				control.state("sat");
			},
		},
		{
			stateName: "sat",
			title: "Display Dark Layer",
			icon: `<span>${basemapDarkIcon}</span>`,
			onClick: function (control) {
				control.button.classList.add("btn");
				// Switch to basemapDark
				basemapSat.removeFrom(control._map);
				basemapDark.addTo(control._map);
				control.state("dark");
			},
		},
	],
});

/************************************************************************************************
 *   GPS Location
 ************************************************************************************************/

const gpsPositionIcon = L.divIcon({
	html: GPSPositionIcn,
	className: "position-marker-icon",
	iconSize: [30, 30], // size of the icon
	iconAnchor: [15, 15], // point of the icon which will correspond to marker's location, relative to its top left showCoverageOnHover
});

//for gps location
const options = {
	enableHighAccuracy: true,
	timeout: 5000,
	maximumAge: 0,
};

function success(pos) {
	const crd = pos.coords;
	const lat = pos.coords.latitude;
	const lng = pos.coords.longitude;
	currentLocation = [lat, lng];
}

function error(err) {
	console.warn(`ERROR(${err.code}): ${err.message}`);
}

navigator.geolocation.getCurrentPosition(success, error, options);

var gpsButton = L.easyButton({
	id: "gps",
	class: "easyButton",
	position: "topright",
	states: [
		{
			icon: `<span>${GPSIcn}</span>`,
			//stateName: 'check-mark',
			onClick: function (control) {
				if (currentLocation !== undefined && currentLocation[0] !== null) {
					L.marker(currentLocation, {
						icon: gpsPositionIcon,
						draggable: false,
						zIndexOffset: 100,
					}).addTo(control._map);
					control._map.panTo(currentLocation, 10);
				} else {
					console.error("GPS not available");
					control.button.src = "images/gpsSearching.gif";
					L.popup()
						.setLatLng(control._map.getCenter()) // or use a specific lat/lng if known
						.setContent("GPS not available. Please check your device settings.")
						.openOn(control._map);
				}
			},
		},
	],
});

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

function addDataToMap(map, mapdata) {
	let layerChatGeom = L.geoJson(mapdata, {
		pointToLayer: function (feature, latlng) {
			return L.circleMarker(latlng, geojsonMarkerOptions);
		},
		onEachFeature: function (feature, layer) {
			if (feature.properties && feature.properties.observations) {
				layer.bindPopup(
					`<div class="map-popup-body">
                      ${feature.properties.observations.replaceAll(
												"\n",
												"<br/>"
											)}
                    </div>
                    <div class="map-popup-footer">
                      ${i18next.t("date")}: ${getFriendlyDatetime(
						feature.properties.datetime
					)}<br/>
                      ${i18next.t("observer")}: ${feature.properties.observer}
                    </div>`
				);
			}
			if (feature.properties && feature.properties.markerColour) {
				layer.options.fillColor = feature.properties.markerColour;
			}
		},
	}).addTo(map);
	let bounds = map.getBounds();
	let boundsLayer = layerChatGeom.getBounds();
	setTimeout(function () {
		map.fitBounds(boundsLayer, {
			maxZoom: 16,
			paddingBottomRight: [0, 0],
		});
	});
}

/************************************************************************************************
 * Share image
 ************************************************************************************************/
var printBtn = L.easyPrint({
	hidden: true,
	sizeModes: ["A4Portrait"],
});

/************************************************************************************************
 * Map action tray
 ************************************************************************************************/
buildActionTray();
/************************************************************************************************
 *  Display Map
 ************************************************************************************************/

export function removeMap() {
	let modal = document.getElementById("sharing-modal");
	closeModal(modal); // have to do this before removing the actions
	document.querySelector("#map").remove();
	document.getElementById("map-actions-container").remove();

	// Remove all layers or they get confused when you try to reinstantiate the map
	basemapDark.remove();
	basemapSat.remove();
	displayOptionsMenu();
}

function displayMap(mapdata) {
	let mapContainer = document.createElement("div");
	mapContainer.id = "map";
	document.querySelector("#main").appendChild(mapContainer);
	var southWest = L.latLng(-70, -180);
	var northEast = L.latLng(80, 180);
	var map = L.map("map", {
		renderer: L.canvas({ padding: 0.5, tolerance: 8 }),
		editable: true,
		center: [0, 0], //global center
		zoom: 2,
		minZoom: 2,
		maxZoom: 21,
		zoomControl: false,
		attributionControl: false,
		maxBounds: L.latLngBounds(southWest, northEast),
	});
	let attribution = L.control
		.attribution({
			position: "bottomright",
			prefix: "",
		})
		.addTo(map);
	attributionContainer = attribution.getContainer();

	let scale = L.control
		.scale({
			maxWidth: 100,
			metric: true,
			imperial: false,
			position: "bottomleft",
		})
		.addTo(map);
	scaleLine = scale.getContainer().querySelector(".leaflet-control-scale-line");

	var mapTitle = L.DomUtil.create("div", "leaflet-map-title");
	map.getContainer().appendChild(mapTitle);

	basemapDark.addTo(map);
	basemapButton.addTo(map);
	gpsButton.addTo(map);
	printBtn.addTo(map);

	if (mapdata) {
		addDataToMap(map, mapdata);
	}

	var actionTray = buildActionTray();
	const parent = document.querySelector("#main");
	parent.appendChild(actionTray);
}

export { displayMap };

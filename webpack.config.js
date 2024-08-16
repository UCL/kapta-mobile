var webpack = require("webpack");
var path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const WorkboxPlugin = require("workbox-webpack-plugin");
const WebpackPwaManifest = require("webpack-pwa-manifest");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
	mode: "development",
	// Specify the entry point for our app.
	entry: {
		main: "./src/main.js",
		status: "./src/status.js",
	},
	devServer: {
		static: "./dist",
		devMiddleware: {
			index: true,
			mimeTypes: { phtml: "text/html" },
			publicPath: "/dist",
			serverSideRender: true,
			writeToDisk: true,
		},
	},
	// Specify the output file containing our bundled code.
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "[name].bundle.js",
		clean: false,
	},
	// Enable WebPack to use the 'path' package.
	resolve: {
		fallback: { path: require.resolve("path-browserify") },
	},
	optimization: {
		runtimeChunk: "single",
	},
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
				type: "asset/resource",
			},
		],
	},
	plugins: [
		new webpack.ProvidePlugin({
			L: "leaflet",
		}),
		new CopyPlugin({
			patterns: [
				{
					from: "./src/images/icons/kapta-white.png",
					to: "og-icon.png",
				},
			],
		}),
		new HtmlWebpackPlugin({
			template: "./src/index.html",
			title: "Kapta",
			favicon: "src/images/icons/favicon.ico",
			meta: {
				"Content-Security-Policy": {
					"http-equiv": "Content-Security-Policy",
					content: "text/html; charset=UTF-8",
				},
				viewport:
					"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
				"og:title": {
					property: "og:title",
					content: "Kapta",
				},
				"og:description": {
					property: "og:description",
					content: "🗺️",
				},
				"og:image": {
					property: "og:image",
					itemprop: "image",
					content: "https://kapta.earth/og-icon.png",
				},
				"og:image:type": {
					property: "og:image:type",
					content: "image/png",
				},
				"og:image:width": {
					property: "og:image:width",
					content: "476",
				},
				"og:image:height": {
					property: "og:image:height",
					content: "249",
				},
			},
			appMountIds: ["main", "sharing-modal"],
			manifest: "src/manifest.webmanifest",
		}),
		new WorkboxPlugin.InjectManifest({
			swSrc: "./src/sw.js",
			maximumFileSizeToCacheInBytes: 5242880, // 5MB
		}),
		new WebpackPwaManifest({
			publicPath: "/",
			name: "Kapta",
			short_name: "Kapta",
			lang: "en-GB",
			theme_color: "#000000",
			background_color: "#000000",
			display: "standalone",
			orientation: "portrait",
			start_url: "/",
			share_target: {
				action: "/share-target",
				method: "POST",
				enctype: "multipart/form-data",
				params: {
					title: "name",
					text: "description",
					url: "link",
					files: [
						{
							name: "file",
							accept: ["*/*"],
						},
						{
							name: "lists",
							accept: ["text/plain", ".txt"],
						},
						{
							name: "geographies",
							accept: ["application/json", ".geojson"],
						},
						{
							name: "docs",
							accept: [
								"application/msword",
								"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
							],
						},
						{
							name: "zips",
							accept: ["application/zip"],
						},
						{
							name: "codes",
							accept: [
								"text/html",
								"text/css",
								"text/javascript",
								"application/json",
								"application/xml",
							],
						},
						{
							name: "others",
							accept: ["*/*"],
						},
					],
				},
			},
			icons: [
				{
					src: path.resolve("src/images/icons/kapta-white.png"),
					sizes: [72, 96, 128, 192, 256, 512],
				},
				{
					src: path.resolve("src/images/icons/kapta-white.png"),
					size: "512x512",
					purpose: "maskable",
				},
			],
		}),
	],
	/**
    * In Webpack version v2.0.0 and earlier, you must tell 
    * webpack how to use "json-loader" to load 'json' files.
    * To do this Enter 'npm --save-dev install json-loader' at the 
    * command line to install the "json-loader' package, and include the 
    * following entry in your webpack.config.js.
    * module: {
      rules: [{test: /\.json$/, use: use: "json-loader"}]
    }
    **/
};

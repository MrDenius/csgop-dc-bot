const express = require("express");
const path = require("path");

module.exports = (() => {
	const api = {};

	const app = express();

	const data = { test: "it is test!" };

	app.get("/", (req, res, next) => {
		res.sendFile(path.join(__dirname, "/site/index.html"));
	});
	app.get("/data", (req, res, next) => {
		res.send(`const data = ${JSON.stringify(data)}`);
	});
	app.get("/main.js", (req, res, next) => {
		res.sendFile(path.join(__dirname, "/site/main.js"));
	});
	app.get("/styles.css", (req, res, next) => {
		res.sendFile(path.join(__dirname, "/site/styles.css"));
	});

	api.Start = (port) => {
		setTimeout(() => app.listen(port || 80), 0);
		console.log("SERVER STARTED!");
	};
	api.Data = data;

	return api;
})();

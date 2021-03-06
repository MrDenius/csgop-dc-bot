const { default: Axios } = require("axios");
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

	const Worker = () => {
		data.upTime = process.uptime();
		data.upTimeFormated = `${Math.floor(
			data.upTime / 60 / 60
		)}:${Math.floor(Math.floor(data.upTime / 60) % 60)}:${Math.floor(
			(data.upTime % 60) % 60
		)}`;
	};

	const AntiIdling = () => {
		Axios.get("https://csgop-dc-bot.herokuapp.com/")
			.then(() => console.log("Anti Idling success"))
			.catch((res) => console.error(`Error Anti Idling: ${res}`));
	};

	setInterval(Worker, 250);
	if (process.env.PORT) setInterval(AntiIdling, 120000);

	api.Start = (port) => {
		setTimeout(() => app.listen(process.env.PORT || port || 80), 0);
		console.log("SERVER STARTED!");
	};
	api.Data = data;

	return api;
})();

const child_process = require("child_process");

const StartIndex = () => {
	console.log("Starting index.js...");
	const index = child_process.spawn("node", ["./index.js"]);

	const conLog = (text, log) => {
		text = text.trim();
		if (process.env.PORT && text.length != 0) {
			if (log) log(text);
			else console.log(text);
		}
	};

	index.stdout.on("data", (data) => conLog(data.toString()));
	index.stdout.on("error", (data) => conLog(data.toString(), console.error));

	let exited = false;
	const OnExit = (code) => {
		if (exited) return;
		exited = true;
		console.error(`Index exited with code ${code}!\nRestarting...`);
		StartIndex();
	};

	index.on("close", OnExit);
	index.on("exit", OnExit);

	return index;
};

StartIndex();

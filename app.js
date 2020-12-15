const child_process = require("child_process");

const StartIndex = () => {
	console.log("Starting index.js...");
	const index = child_process.spawn("node", ["./index.js"]);
	//index.stdout.on("data", (data) => console.log(data.toString()));
	//index.stdout.on("error", (data) => console.log(data.toString()));

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

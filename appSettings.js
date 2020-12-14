const { readFileSync, writeFileSync, existsSync } = require("fs");

module.exports = (() => {
	const api = {};
	let users;
	const GetAllUsers = () => {
		if (!users)
			if (existsSync("./users.json")) {
				const jsonData = readFileSync("./users.json", "utf8");
				console.log(jsonData);
				try {
					if (Array.isArray(JSON.parse(jsonData))) {
						users = JSON.parse(jsonData);
					} else {
						users = [];
					}
				} catch {
					users = [];
				}
			} else users = [];
		return users;
	};
	const Save = () => {
		writeFileSync("./users.json", JSON.stringify(GetAllUsers()));
	};

	const AddUser = (user) => {
		GetAllUsers().push(user.chat);
		Save();
	};

	const RemoveUser = (user) => {
		user = user.chat;
		const newUsers = [];
		GetAllUsers().forEach((element) => {
			if (element.id != user.id) {
				newUsers.push(element);
				console.log([element.id, user.id]);
			}
		});
		users = newUsers;
		Save();
	};

	const UserExist = (user) => {
		user = user.chat;
		let ret = false;
		GetAllUsers().forEach((element) => {
			if (element.id === user.id) {
				ret = true;
				return ret;
			}
		});
		return ret;
	};

	api.GetAllUsers = GetAllUsers;
	api.Save = Save;
	api.AddUser = AddUser;
	api.RemoveUser = RemoveUser;
	api.UserExist = UserExist;

	return api;
})();

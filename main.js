const { default: Axios } = require("axios");
const { default: parse } = require("node-html-parser");
const { Telegraf } = require("telegraf");
const appSettings = require("./appSettings");
const discountChecker = require("./discountChecker");

const bot = new Telegraf("1476521215:AAE2aoxWACDCJc2Y62ZyjgPjwzJLXyq9JwU"); //сюда помещается токен, который дал botFather

bot.start((ctx) => ctx.reply("Welcome")); //ответ бота на команду /start

// discountChecker.on("default", (pInfo) => {
// 	appSettings.GetAllUsers().forEach((user) => {
// 		bot.telegram.sendMessage(
// 			user.id,
// 			`Актуальная цена: ${pInfo.price}\nСкидка: ${pInfo.discount}`
// 		);
// 	});
// });
discountChecker.on("discount", (pInfo) => {
	appSettings.GetAllUsers().forEach((user) => {
		bot.telegram.sendMessage(
			user.id,
			`СКИДКА!!!!!\nАктуальная цена: ${pInfo.price}\nСкидка: ${pInfo.discount}`
		);
	});
});

bot.hears("/status", (ctx) => {
	ctx.reply("Loading...");

	discountChecker.GetPriceInfo().then((res) => {
		ctx.reply(res);
	});
});
bot.hears("/call", (ctx) => {
	if (appSettings.UserExist(ctx.message)) {
		appSettings.RemoveUser(ctx.message);
		ctx.reply("Вы удалины из рассылки!");
	} else {
		appSettings.AddUser(ctx.message);
		ctx.reply("Вы добавленны в рассылку!");
	}
});

discountChecker.Start();

bot.launch(); // запуск бота

const { default: Axios } = require("axios");
const { default: parse } = require("node-html-parser");
const { Telegraf } = require("telegraf");
const appSettings = require("./appSettings");
const debugSite = require("./debugSite");
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

bot.hears("/exit 123456987", (ctx) => {
	ctx.reply("Exit in 5 seconds!");
	setTimeout(() => process.exit(0), 5000);
});

bot.command("debug", (ctx) => {
	let mess = `Up time: ${debugSite.Data.upTimeFormated}\nStatus:\n`;

	discountChecker.GetPriceInfo().then((price) => {
		if (price) {
			mess += "🟢";
		} else {
			mess += "🔴";
		}
		mess += " PriceChecker\n";

		ctx.replyWithMarkdown(mess);
	});
});

bot.hears("/status", (ctx) => {
	ctx.reply("Loading...");

	discountChecker.GetPriceInfo().then((res) => {
		let mess = `
Скидк${res.discount ? "а __*есть*__" : "и __*нету*__"}
Актуальная цена на данный момент: __*${res.price}₽*__\n`;

		mess += `Вы `;

		mess += appSettings.UserExist(ctx.message)
			? "подписаны на рассылку"
			: "отписаны от рассылки";

		ctx.replyWithMarkdown(mess, { parse_mode: "MarkdownV2" });
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

debugSite.Start(); // запуск дебаг серва
bot.launch(); // запуск бота

console.log("BOT STARTED!");

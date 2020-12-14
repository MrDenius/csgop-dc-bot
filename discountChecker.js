const { EventEmitter } = require("events");
const { default: Axios } = require("axios");
const { default: parse } = require("node-html-parser");

module.exports = (() => {
	const api = {};

	const EventListerner = new EventEmitter();

	let enabled = false;
	let interval = 2500;

	/**
	 * @returns {Promise}
	 */
	const GetPriceInfo = () => {
		return new Promise((resolve, rej) => {
			Axios.get(
				"https://store.steampowered.com/widget/1490530/?cc=ru"
			).then((res) => {
				let doc = parse(res.data);
				const contener = doc.querySelector(".game_purchase_action_bg");
				const PriceInfo = {};

				const parseInt = (str) => {
					return Number.parseInt(str.replace(/[^0-9.]/g, ""));
				};

				if (contener.querySelector(".price") != null) {
					PriceInfo.price = parseInt(
						contener.querySelector(".price").innerHTML
					);
					PriceInfo.discount = false;
				} else {
					PriceInfo.price = parseInt(
						contener.querySelector(".discount_final_price")
							.innerHTML
					);
					PriceInfo.discount = true;
				}
				resolve(PriceInfo);
			});
		});
	};

	const Worker = () => {
		if (enabled) {
			GetPriceInfo().then((pInfo) => {
				console.log({
					Log: "Start checking.",
					price: pInfo.price,
					discount: pInfo.discount,
				});
				if (pInfo.discount) {
					EventListerner.emit("discount", pInfo);
				} else {
					EventListerner.emit("default", pInfo);
				}
				setTimeout(Worker, interval);
			});
		}
	};

	const Start = () => {
		enabled = true;
		setTimeout(Worker, 0);
	};

	const Stop = () => {
		enabled = false;
	};

	api.GetPriceInfo = GetPriceInfo;
	api.on = (string, listener) => EventListerner.on(string, listener);
	api.Start = Start;
	api.Stop = Stop;

	return api;
})();

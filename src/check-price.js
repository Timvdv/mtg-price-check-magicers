import puppeteer from 'puppeteer';
import path from 'path';
import { deck } from './deck.js';

global.__dirname = path.resolve('./');

const browser = await puppeteer.launch();

let currentCard = 0;
const cardTotal = deck.length;
const cardResults = [];

console.log(`Starting price check for ${cardTotal} cards`);
console.time("priceCheck");

for await (const card of deck) {
	currentCard++;

	console.log(`Checking ${card} (${currentCard}/${cardTotal})`);

	const page = await browser.newPage();
	const url = `https://www.magicers.nl/webshop/zoekopdracht_${encodeURIComponent(card)}`;


	await page.goto(url, { timeout: 0, waitUntil: 'load' });

	await page.waitForFunction(
		'document.querySelector(".list_mtgdef_price")',
	);

	const cardPrice = await page.evaluate(
	  () => document.querySelectorAll(".list_mtgdef_price")[0].textContent
	);

	cardResults.push({
		name: card,
		url: url,
		price: cardPrice.split("\n")[1].trim().replace(",", ".")
	})
};

console.log(cardResults);

console.log("Finished in:")
console.timeEnd("priceCheck");

const totalPrice = cardResults.reduce((acc, curr) => {
	return acc + parseFloat(curr.price.replace(/[^0-9\.]+/g, ''));
}, 0.00);

console.log(`The total price of the deck is €${totalPrice}`);

await browser.close();

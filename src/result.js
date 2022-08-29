// Deck list without commander / lands
const results = [

]

// Price calculation
result.reduce((acc, curr) => {
	return acc + parseFloat(curr.price.replace(/[^0-9\.]+/g, ''));
}, 0.00);

// Returns: 34.799999999999976

// Open all tabs in the browser (do this in chrome, firefox only opens 10)
results.map(result => window.open(result.url))
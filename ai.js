function buildPrompt(product) {
	return `You write short ad copy for a 300x250 banner.

Use ONLY these approved facts. Do not add any other claims, prices, or awards.
Product: ${product.name}
Price: $${product.price}
Facts:
${product.facts.map((fact) => `- ${fact}`).join("\n")}

Rules:
- Headline: 30 characters max
- Body: 60 characters max
- CTA: 20 characters max
- No superlatives like "best" or "#1"
- If you can't write good copy from these facts alone, return {"error": "insufficient facts"}

Return ONLY JSON in this shape:
{"headline": "", "body": "", "cta": "", "factsUsed": []}`;
}

const fakeAiResponses = {
	hotdog: `{"headline": "Chicago's Classic Dog", "body": "No ketchup, just $10.", "cta": "Grab One", "factsUsed": ["No ketchup"]}`,
	deepdish: `{"headline": "The Best Deep Dish in America", "body": "Buttery crust, award-winning taste.", "cta": "Order Now", "factsUsed": ["Buttery crust", "Award-winning"]}`,
	beef: `{"headline": "Italian Beef, Dunked", "body": "Dunked in au jus. Only $19!", "cta": "Get Yours", "factsUsed": ["Dunked in au jus"]}`,
	popcorn: `{"headline": "Popcorn Party Packs", "body": "Caramel and white cheddar, free shipping.", "cta": "Shop Popcorn"`,
};

const LIMITS = { headline: 30, body: 60, cta: 20 };

function validateCopy(rawText, product) {
	let copy;
	try {
		copy = JSON.parse(rawText);
	} catch (error) {
		return { ok: false, errors: ["Not valid JSON"] };
	}

	if (copy.error) {
		return { ok: false, errors: [`AI declined: ${copy.error}`] };
	}

	const errors = [];

	for (const field of ["headline", "body", "cta"]) {
		if (typeof copy[field] !== "string" || copy[field].trim() === "") {
			errors.push(`Missing ${field}`);
		} else if (copy[field].length > LIMITS[field]) {
			errors.push(`${field} is over ${LIMITS[field]} characters`);
		}
	}

	return { ok: errors.length === 0, copy, errors };
}

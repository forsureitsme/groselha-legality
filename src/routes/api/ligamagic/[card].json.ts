/** @type {import('@sveltejs/kit').RequestHandler} */

import * as cheerio from 'cheerio';
import acorn, { Parser } from 'acorn';

async function checkBanlistLegality({ card }) {
	const deckId = 3109176;
	const banlistUrl = `https://www.ligamagic.com/?view=dks/deck&id=${deckId}&lang=2`;

	const ligaMagic: string = await fetch(banlistUrl)
		.then((response) => response.text())
		.catch(function (error) {
			throw error;
		});

	const $ = cheerio.load(ligaMagic);

	const banlist = [
		...new Set(
			$('#deck-view .deck-card a').map((i, deckCard : cheerio.TagElement) =>
				decodeURIComponent(
					deckCard.attribs.href.substring('./?view=cards/card&card='.length)
				).replace(/\+/g, ' ')
			)
		)
	];

	return {
		isInBanlist: banlist.includes(card),
		banlistUrl
	};
}

export async function get({ params }) {
	try {
		// Check Talisman Store's banlist
		const { isInBanlist, banlistUrl } = await checkBanlistLegality({
			card: params.card
		});

		if (isInBanlist) {
			return {
				body: {
					isLegal: !isInBanlist,
					moreInfoLink: banlistUrl,
					...(isInBanlist && {
						reason: `Está na banlist do formato Groselha.`
					})
				}
			};
		}

		// Check price legality
		const date = new Date();
		const endMonth = `${date.getFullYear()}-${(date.getMonth() + 1 + '').padStart(2, '0')}`;

		date.setMonth(date.getMonth() - 1);
		const startMonth = `${date.getFullYear()}-${(date.getMonth() + 1 + '').padStart(2, '0')}`;

		const { wasUnderTenBrazillianReaisInRotation, priceLegalityInfo } = await checkPriceLegality({
			card: params.card,
			startMonth,
			endMonth
		});

		return {
			body: {
				isLegal: wasUnderTenBrazillianReaisInRotation,
				moreInfoLink: priceLegalityInfo,
				...(!wasUnderTenBrazillianReaisInRotation && {
					reason: `Não esteve por menos de R$10 na LigaMagic no período da rotação (meses ${startMonth} até ${endMonth}).`
				})
			}
		};
	} catch (error) {
		return {
			status: 500,
			body: error
		};
	}
}

/**
 * Receives an Acorn node and returns the parsed value from the expression.
 * @param node Acorn node
 * @returns Parsed expression
 */
function getValue(node: any) {
	if (node.type === 'ObjectExpression') {
		return node.properties.reduce(
			(obj: object, property: unknown) => ({ ...obj, ...getValue(property) }),
			{}
		);
	}

	if (node.type === 'ArrayExpression') {
		return [...node.elements.map((property: unknown) => getValue(property))];
	}

	if (node.type === 'Property') {
		return {
			[getValue(node.key)]: getValue(node.value)
		};
	}

	if (node.type === 'Identifier') {
		return node.name;
	}

	if (node.type === 'Literal') {
		return node.value;
	}

	return node.value;
}

async function checkPriceLegality({ card, startMonth, endMonth }) {
	/**
	 * Request params:
	 * {
	 * 	show=2 // Historic prices tab
	 * 	campo=1 // Show data using "least price" field
	 * }
	 */
	const requestUrl = `https://www.ligamagic.com.br/?view=cards/card&show=2&campo=1&card=${card}&mesHistoricoInicio=${startMonth}&mesHistoricoFim=${endMonth}`;
	const ligaMagic: string = await fetch(requestUrl)
		.then((response) => response.text())
		.catch(function (error) {
			throw error;
		});

	const $ = cheerio.load(ligaMagic);

	const $script: cheerio.TagElement = $('script')
		.toArray()
		.find((node: cheerio.TagElement) => {
			return node.children.find((childNode: cheerio.Element) =>
				childNode.data.includes('Highcharts.chart')
			);
		});

	const code: acorn.Node = Parser.parse(
		$script.children.find((childNode: cheerio.Element) =>
			childNode.data.includes('Highcharts.chart')
		).data,
		{
			ecmaVersion: 'latest'
		}
	);

	const chartParams = code.body[0].expression.arguments[1];
	const setPrices: [MagicSet] = getValue(chartParams).series;

	const wasUnderTenBrazillianReaisInRotation = setPrices.some((set: MagicSet) =>
		set.data.some((price: number) => price <= 10)
	);

	return {
		wasUnderTenBrazillianReaisInRotation,
		priceLegalityInfo: requestUrl
	};
}

/** @type {import('@sveltejs/kit').RequestHandler} */

import * as cheerio from 'cheerio';
import acorn, { Parser } from 'acorn';

export async function get({ params }) {
	try {
		const date = new Date();
		const endMonth = `${date.getFullYear()}-${(date.getMonth() + 1 + '').padStart(2, '0')}`;

		date.setMonth(date.getMonth() - 1);
		const startMonth = `${date.getFullYear()}-${(date.getMonth() + 1 + '').padStart(2, '0')}`;

		/**
		 * Parâmetros da requisição:
		 * {
		 * 	show=2 // Mostra aba de histórico
		 * 	campo=1 // Visualiza dados a partir do menor preço registrado nos meses
		 * }
		 */
		const requestUrl = `https://www.ligamagic.com.br/?view=cards/card&show=2&campo=1&card=${params.card}&mesHistoricoInicio=${startMonth}&mesHistoricoFim=${endMonth}`;
		const ligaMagic: string = await fetch(requestUrl)
			.then((response) => response.text())
			.catch(function (error) {
				throw error;
			});

		const $ = cheerio.load(ligaMagic);

		const $script : cheerio.TagElement = $('script')
			.toArray()
			.find((node : cheerio.TagElement) => {
				return node.children.find((childNode: cheerio.Element) =>
					childNode.data.includes('Highcharts.chart')
				);
			});

		const code : acorn.Node = Parser.parse(
			$script.children.find((childNode: cheerio.Element) => childNode.data.includes('Highcharts.chart'))
				.data,
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
			body: {
				isLegal: wasUnderTenBrazillianReaisInRotation,
				moreInfoLink: requestUrl
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
function getValue(node : any) {
	if (node.type === 'ObjectExpression') {
		return node.properties.reduce((obj : object, property : unknown) => ({ ...obj, ...getValue(property) }), {});
	}

	if (node.type === 'ArrayExpression') {
		return [...node.elements.map((property : unknown) => getValue(property))];
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

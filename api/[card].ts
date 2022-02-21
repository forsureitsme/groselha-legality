import cheerio from 'cheerio';
import { Parser } from 'acorn';
import axios from 'axios';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import { getValueFromAcornNode, logError } from '../src/utils';

export default async (request: VercelRequest, response: VercelResponse) => {
	try {
		const { card } = request.query;

		// Check Talisman Store's banlist
		const { isInBanlist, banlistUrl } = await checkBanlistLegality({
			card
		});

		if (isInBanlist) {
			return response.status(200).json({
				isLegal: !isInBanlist,
				moreInfoLink: banlistUrl,
				...(isInBanlist && {
					reason: `Está na banlist do formato Groselha.`
				})
			});
		}

		// Check price legality
		const date = new Date();
		const endMonth = `${date.getFullYear()}-${(date.getMonth() + 1 + '').padStart(2, '0')}`;

		date.setMonth(date.getMonth() - 1);
		const startMonth = `${date.getFullYear()}-${(date.getMonth() + 1 + '').padStart(2, '0')}`;

		const { wasUnderTenBrazillianReaisInRotation, priceLegalityInfo } = await checkPriceLegality({
			card,
			startMonth,
			endMonth
		});

		return response.status(200).json({
			isLegal: wasUnderTenBrazillianReaisInRotation,
			moreInfoLink: priceLegalityInfo,
			...(!wasUnderTenBrazillianReaisInRotation && {
				reason: `Não esteve por menos de R$10 na LigaMagic no período da rotação (meses ${startMonth} até ${endMonth}).`
			})
		});
	} catch (error) {
		logError(error, false);
		return response.status(500).json({
			error
		});
	}
};

async function checkBanlistLegality({ card }) {
	const deckId = 3179093;
	const banlistUrl = `https://www.ligamagic.com/?view=dks/deck&id=${deckId}&lang=2`;

	const ligaMagic: string = await axios({
		url: banlistUrl,
		responseType: 'text'
	})
		.then((response) => response.data)
		.catch(logError);

	const $ = cheerio.load(ligaMagic);

	const banlist = [
		...new Set(
			$('#deck-view .deck-card a').map(({}, deckCard: any) =>
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

async function checkPriceLegality({ card, startMonth, endMonth }) {
	/**
	 * Request params:
	 * 	 show=2 // Historic prices tab
	 * 	 campo=1 // Show data using "least price" field
	 */
	const requestUrl = `https://www.ligamagic.com.br/?view=cards/card&show=2&campo=1&card=${card}&mesHistoricoInicio=${startMonth}&mesHistoricoFim=${endMonth}`;

	const ligaMagic: string = await axios({
		url: requestUrl,
		responseType: 'text'
	})
		.then((response) => response.data)
		.catch(logError);

	const $ = cheerio.load(ligaMagic);

	const $script: any = $('script')
		.toArray()
		.find((node: any) => {
			return node.children.find((childNode: cheerio.Element) =>
				childNode.data.includes('Highcharts.chart')
			);
		});

	const code: any = Parser.parse(
		$script.children.find((childNode: cheerio.Element) =>
			childNode.data.includes('Highcharts.chart')
		).data,
		{
			ecmaVersion: 'latest'
		}
	);

	const chartParams = code.body[0].expression.arguments[1];
	const setPrices: [MagicSet] = getValueFromAcornNode(chartParams).series;

	const wasUnderTenBrazillianReaisInRotation = setPrices.some((set: MagicSet) =>
		set.data.some((price: number) => price <= 10)
	);

	return {
		wasUnderTenBrazillianReaisInRotation,
		priceLegalityInfo: requestUrl
	};
}

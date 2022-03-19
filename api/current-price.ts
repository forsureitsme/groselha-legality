import cheerio from 'cheerio';
import axios from 'axios';

import type { VercelRequest, VercelResponse } from '@vercel/node';

import Sentry from './_sentry';

// const client = new Client({
// 	user: process.env.GL_DB_USER,
// 	host: process.env.GL_DB_HOST,
// 	database: process.env.GL_DB,
// 	password: process.env.GL_DB_PASSWORD,
// 	port: +process.env.GL_DB_PORT
// });
// client.connect();

// const db = process.env.GL_DB_QUALIFIED_NAME;

export default async (request: VercelRequest, response: VercelResponse) => {
	const cardLegalityTransaction = Sentry.startTransaction({
		op: '[card]',
		name: 'Get current card price'
	});

	try {
		const { card } = request.body;
		const price = await getCurrentLigaMagicPrice({ card });

		return response.status(200).send(price);
	} catch (error) {
		Sentry.captureException(error);

		return response.status(500).json({
			error
		});
	} finally {
		cardLegalityTransaction.finish();
	}
};

// const saveToDatabase = ({ name, price }) => {
// 	const date = new Date();
// 	date.setHours(date.getHours() - 3);

// 	const dayOfMonth = ('' + date.getDate()).padStart(2, '0');
// 	const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${dayOfMonth}`;

// client.query(
// 	`
//         INSERT INTO "${db}"."card_prices"(name, price, date)
//         VALUES ('${name}', '${price}', '${dateString}');
//     `,
// 	(err, res) => {
// 		console.table(res.rows); // you could also just console.log, but console.table is neat :)
// 	}
// );
// };

async function getCurrentLigaMagicPrice({ card }) {
	const requestUrl = `https://www.ligamagic.com.br/?view=cards/card&card=${card}`;

	const ligaMagic: string = await axios({
		url: requestUrl,
		responseType: 'text'
	})
		.then((response) => response.data)
		.catch((error) => {
			throw error;
		});

	const $ = cheerio.load(ligaMagic);

	return +$('#alerta-preco .preco-menor .bigger').text().replace(',', '.');
}

import '@sentry/tracing';
import * as Sentry from '@sentry/node';
import pkg from '../package.json';

if (process.env.VERCEL_ENV !== Environment[Environment.dev]) {
	Sentry.init({
		dsn: 'https://906acf3ccefd46338a368a5b78c2e713@o1149821.ingest.sentry.io/6222244',
		release: `${pkg.name}@${pkg.version}`,
		environment: process.env.VERCEL_ENV
	});
}

export default Sentry;

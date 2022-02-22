import * as Sentry from '@sentry/browser';
import { BrowserTracing } from '@sentry/tracing';

if (globalThis.ENVIRONMENT !== Environment.dev) {
	Sentry.init({
		dsn: 'https://906acf3ccefd46338a368a5b78c2e713@o1149821.ingest.sentry.io/6222244',
		release: `@${globalThis.PKG_VERSION}`,
		integrations: [new BrowserTracing()],
		tracesSampleRate: 1.0,
		environment: globalThis.ENVIRONMENT
	});
}

export default Sentry;

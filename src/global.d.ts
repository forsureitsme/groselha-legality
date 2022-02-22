/// <reference types="svelte" />

interface MagicSet {
	name: string;
	data: [number];
}

interface Card {
	name: string;
	legalities: {
		commander: string;
	};
	card_faces?: object;
}

declare var ENVIRONMENT: Environment;

enum Environment {
	dev = 'development',
	test = 'testing',
	prod = 'production'
}

declare module 'simple-svelte-autocomplete';
declare module 'markdown';

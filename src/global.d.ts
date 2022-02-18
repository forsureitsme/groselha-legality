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
}

declare module 'simple-svelte-autocomplete';
declare module 'markdown';

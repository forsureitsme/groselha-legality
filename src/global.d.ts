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

declare module 'simple-svelte-autocomplete';
declare module 'markdown';

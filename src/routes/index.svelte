<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	interface Card {
		name: string;
		legalities: {
			commander: string;
		};
	}

	import AutoComplete from 'simple-svelte-autocomplete';

	async function scryfallSearch(q : string) {
		const url = 'https://api.scryfall.com/cards/search?q=' + encodeURIComponent(q);

		const response = await fetch(url);
		const json = await response.json();

		return json.data;
	}

	let card: Card;

	async function defineLegalityInGroselha(card: Card) {
		if (card.legalities.commander !== 'legal') {
			return {
				isLegal: false,
				reason: 'Não é válida no Commander.'
			};
		}

		const response = await fetch(`/api/ligamagic/${card.name}.json`);
		const { isLegal, reason, moreInfoLink } = await response.json();

		if (!isLegal) {
			return {
				isLegal,
				reason,
				moreInfo: moreInfoLink
			};
		}

		return {
			isLegal
		};
	}
</script>

<svelte:head>
	<title>Legalidade Groselha</title>
</svelte:head>

<section>
	<h1>Legalidade do formato Groselha</h1>

	<AutoComplete
		valueFieldName="name"
		labelFieldName="name"
		searchFunction={scryfallSearch}
		delay="200"
		localFiltering="false"
		bind:selectedItem={card}
	/>

	{#if card}
		{#await defineLegalityInGroselha(card)}
			<p>Carregando...</p>
		{:then legality}
			{#if legality.isLegal}
				<p class="is-legal">
					A carta <b>{card.name}</b> é valida no Groselha hoje! {new Date().toLocaleDateString(
						'pt-br'
					)}
				</p>
			{:else}
				<p class="is-illegal">
					A carta <b>{card.name}</b> não é valida no Groselha hoje! {new Date().toLocaleDateString(
						'pt-br'
					)}
				</p>
				<p>
					{legality.reason}
				</p>
				{#if legality.moreInfo}
					<p>
						<a href={legality.moreInfo} target="_blank">Fonte</a>
					</p>
				{/if}
			{/if}
		{/await}
	{/if}
</section>

<style>
	.is-legal {
		color: green;
	}
	.is-illegal {
		color: red;
	}
</style>

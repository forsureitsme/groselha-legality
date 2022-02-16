<script lang="ts">
	import AutoComplete from 'simple-svelte-autocomplete';
	import Footer from './components/Footer.svelte';

	interface Card {
		name: string;
		legalities: {
			commander: string;
		};
	}

	async function scryfallSearch(q: string) {
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

		const response = await fetch(`/api/${card.name}`);
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

<main>
	<h1>Legalidade do formato Groselha</h1>

	<label for="card"> Digite o nome do card para verificar a legalidade:</label><br />
	<AutoComplete
		valueFieldName="name"
		labelFieldName="name"
		searchFunction={scryfallSearch}
		delay="200"
		localFiltering="false"
		bind:selectedItem={card}
		id="card"
	/>

	{#if card}
		{#await defineLegalityInGroselha(card)}
			<p>Carregando...</p>
		{:then legality}
			{#if legality.isLegal}
				<p class="text-green">
					A carta <b>{card.name}</b> é valida no Groselha hoje!
					{new Date().toLocaleDateString('pt-br')}
				</p>
			{:else}
				<p class="text-red">
					A carta <b>{card.name}</b> não é valida no Groselha hoje!
					{new Date().toLocaleDateString('pt-br')}
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
		{:catch error}
			<p class="text-yellow">
				Não foi possível verificar a legalidade no momento. Tente novamente mais tarde.
			</p>
			<div class="text-red">
				<p>Erro:</p>
				<code>{error}</code>
			</div>
		{/await}
	{/if}

	<Footer />
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 640px;
		margin: 0 auto;
	}

	.text-green {
		color: green;
	}
	.text-yellow {
		color: yellow;
	}
	.text-red {
		color: red;
	}
</style>

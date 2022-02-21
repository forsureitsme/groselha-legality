<script lang="ts">
	import AutoComplete from 'simple-svelte-autocomplete';
	import Footer from './components/Footer.svelte';
	import Header from './components/Header.svelte';
	import { assertFecth } from './utils';

	let card: Card;

	async function scryfallSearch(q: string) {
		const url = 'https://api.scryfall.com/cards/search?q=' + encodeURIComponent(q);

		const response = await fetch(url);
		assertFecth(response);

		const json = await response.json();

		return json.data;
	}

	async function defineLegalityInGroselha(card: Card) {
		if (card.legalities?.commander !== 'legal') {
			return {
				isLegal: false,
				reason: 'Não é válida no Commander.'
			};
		}

		let { name } = card;
		if (card.card_faces) {
			name = card.card_faces[0].name;
		}

		const response = await fetch(`/api/${name}`);
		assertFecth(response);

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

<div class="App">
	<Header />
	<main>
		<AutoComplete
			valueFieldName="name"
			labelFieldName="name"
			searchFunction={scryfallSearch}
			delay="200"
			localFiltering="false"
			bind:selectedItem={card}
			id="card"
			placeholder="Digite aqui"
			noResultsText="Sem resultados"
			hideArrow
			showClear
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
	</main>
	<Footer />
</div>

<style>
	.App {
		display: grid;
		grid-template-rows: auto 1fr auto;
		min-height: 100vh;
	}

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

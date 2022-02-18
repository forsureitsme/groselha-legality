<script>
	import Auth from './Auth.svelte';
</script>

<header>
	<Auth />
	<h1>Legalidade do formato Groselha</h1>
	<p>
		<a
			href="https://github.com/forsureitsme/groselha-legality/tree/main/CHANGELOG.md"
			target="_blank"
		>
			<img
				src="https://img.shields.io/github/package-json/v/forsureitsme/groselha-legality?color=%23FEA0ED&label=Vers%C3%A3o&style=for-the-badge"
				alt="Versão"
			/>
			<img
				src="https://img.shields.io/github/last-commit/forsureitsme/groselha-legality/main?color=FEA0ED&label=%C3%9Altima%20Altera%C3%A7%C3%A3o&style=for-the-badge"
				alt="Última Alteração"
			/>
		</a>
	</p>
</header>

<style>
	header {
		text-align: center;
	}

	a {
		text-decoration: none;
	}
</style>

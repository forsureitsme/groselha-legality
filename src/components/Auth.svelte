<script lang="ts">
	import { onAuthStateChanged, signOut } from 'firebase/auth';
	import { auth, signIn } from '../firebase';

	let user;

	onAuthStateChanged(auth, (userAuth) => {
		user = userAuth ? userAuth : false;
	});
</script>

<div>
	<br />
	{#if user}
		Olá {user.displayName}!
		<br /><br />
		<button on:click={() => signOut(auth)}> Sair </button>
	{:else if user === false}
		<button on:click={signIn}> Entrar </button>
	{:else}
		Carregando...
	{/if}
	<hr />
</div>

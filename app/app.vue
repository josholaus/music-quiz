<template>
	<div>
		<div class="absolute z-10 t-0 w-full h-full flex items-center justify-center md:bg-transparent bg-gray-100">
			<div class="h-max md:w-auto w-screen rounded-none md:rounded-xl absolute p-10 md:p-16 bg-gray-100 text-center md:shadow-xl">
				<p class="text-3xl font-medium tracking-wide">Josholaus Music Quiz</p>
				<p class="text-sm tracking-wide">A (non functional) Spotify music quiz</p>
				<NuxtPage/>
				<GlobalFooter/>
			</div>
		</div>
		<GlobalBackground />
	</div>
</template>

<script lang="ts">
export default {
	head() {
		return {
			meta: [
				{
					name: 'description',
					content: 'Music Quiz by Josholaus',
				},
			],
		}
	},
}
</script>

<style>
body {
	background-color: #3b82f6;
}
</style>

<template>
	<div class="text-xs text-zinc-500">
		<p>© {{ year }} Josholaus</p>
	</div>
</template>

<script lang="ts">
export default {
	computed: {
		year() {
			return new Date().getFullYear()
		},
	},
}
</script>
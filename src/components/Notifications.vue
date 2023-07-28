<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
const $store = useStore()
	
const data = computed(() => {
	return $store.state.notifications.all;
});

</script>

<template>
  <div class="notifications">
    <div class="notification" v-for="notification in data" :class="notification.type">
			<h2>{{notification.type}}</h2>
			{{notification.text}}
		</div>
  </div>
</template>

<style lang="scss">
.notifications {
	position: fixed;
	right: 20px;
	bottom: 20px;
	z-index: 9;

	.notification {
		background: #5d5d5d;
		color: #fff;
		padding: 10px 20px;
		max-width: 300px;
		margin-top: 20px;
		text-align: left;
		line-height: 1.3em;
    --tile-width: 360px;
    --tile-padding: 4px;
    --tile-edges: 20px;
    --label-margins: calc(var(--tile-edges) - var(--tile-padding));
		--og-clip-path: polygon(0 0, 0 calc(100% - var(--tile-edges)), var(--tile-edges) 100%, 100% 100%, 100% var(--tile-edges), calc(100% - var(--tile-edges)) 0);
    width: var(--tile-width);
    min-height: 60px;
    clip-path: var(--og-clip-path);

		h2 {
			text-transform: capitalize;
			font-weight: bold;
			font-size: 18px;
		}
	}

	.notification.error {
		background: #ff8893;
		color: #ffeffa;
	}

	.notification.success {
		background: #22dfc0;
		color: #fff;
	}

	.notification.hidden {
		display: none;
	}
}
</style>

import { defineAsyncComponent } from 'vue'

export const LazyHeroConsole = defineAsyncComponent({
  loader: () => import('./HeroConsole.vue'),
  loadingComponent: () => import('./HeroConsoleLoading.vue'),
})

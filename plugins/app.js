import BlockViewer from '@/components/BlockViewer.vue';

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.component('BlockViewer', BlockViewer);
});

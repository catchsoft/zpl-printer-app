<script setup>
import {ref} from 'vue';

import AppSubMenu from './AppSubMenu.vue';

const model = ref([
    {
        label: 'Ana Sayfa',
        icon: 'pi pi-home',
        items: [
            {
                label: 'Tablo',
                icon: 'pi pi-fw pi-home',
                to: '/'
            },
        ]
    }
]);
</script>

<template>
    <AppSubMenu :model="model" />
</template>

<style lang="scss" scoped></style>

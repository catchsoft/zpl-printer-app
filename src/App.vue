<script setup>
import {FilterMatchMode} from 'primevue/api';
import {onBeforeMount, onMounted, ref} from 'vue';
import {ProductService} from '@/service/ProductService';
import {connectPrinter, printFunc} from "@/service/PrintService";
import { connectScanner } from '@/service/BluetoothService';


const products = ref(null);
const selectedProducts = ref(null);
const dt = ref(null);
const filters = ref({});

const productService = new ProductService();
onBeforeMount(() => {
  initFilters();
});
onMounted(() => {
  connectPrinter()
  productService.getPrintJson().then((data) => (products.value = data));
});


const handler = (stringVal) => {
    console.log(stringVal)
    filters.value['global'].value = stringVal;
};


const initFilters = () => {
  filters.value = {
    global: {value: null, matchMode: FilterMatchMode.CONTAINS}
  };
};

const printProduct = (product) => {
  printFunc(product.code)
};

const onKeyDown = (data) => {
  console.log(data)
  if (data.key === 'b') {
    console.log("B pressed")
    const index = data.target.attributes['data-p-index'].nodeValue
    const product = products.value[index]
    printProduct(product)
  }
};
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <Toolbar>
        <template v-slot:start>

          <p id="label"></p>
          <Button id="connectbtn" label="Connect" icon="pi pi-plus" class="mr-2" @click="connectPrinter()"/>
          <Button id="connectscanner" label="Connect Scanner" icon="pi pi-plus" class="mr-2" @click="connectScanner(handler)"/>
          <p id="printer"></p>
        </template>
      </Toolbar>
      <div class="card">
        <DataTable
            ref="dt"
            :value="products"
            @keydown="onKeyDown"
            v-model:selection="selectedProducts"
            dataKey="id"
            :paginator="true"
            :rows="10"
            selectionMode="single"
            :filters="filters"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[5, 10, 25]"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
        >
          <template #header>
            <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
              <h5 class="m-0">Manage Products</h5>
              <IconField iconPosition="left" class="block mt-2 md:mt-0">
                <InputIcon class="pi pi-search"/>
                <InputText class="w-full sm:w-auto" v-model="filters['global'].value" placeholder="Search..."/>
              </IconField>
            </div>
          </template>

          <Column field="code" header="Code" :sortable="true" headerStyle="width:14%; min-width:10rem;">
            <template #body="slotProps">
              <span class="p-column-title">Code</span>
              {{ slotProps.data.code }}
            </template>
          </Column>
        </DataTable>
      </div>
    </div>
  </div>
</template>

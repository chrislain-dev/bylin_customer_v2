<script setup lang="ts">


definePageMeta({

      middleware: "sanctum:auth",
      layout: "account"

});


const wishlist = useWishlist();


const cartStore = useCartStore();



await wishlist.fetchWishlist();



function productImage(product: any) {


      return product?.media?.[0]?.original_url
            ?? "/images/product-placeholder.jpg";


}


function price(value: number) {

      return new Intl.NumberFormat(
            "fr-FR",
            {
                  style: "currency",
                  currency: "EUR"
            }
      ).format(value / 100);


}



</script>



<template>

      <div class="space-y-6 font-syne">


            <h1 class="text-3xl font-black uppercase">
                  Mes favoris
            </h1>




            <div v-if="wishlist.items.length" class="grid md:grid-cols-3 gap-6">


                  <div v-for="item in wishlist.items" :key="item.id" class="bg-white rounded-[2rem] p-5 border">



                        <img :src="productImage(item.product)" class="rounded-2xl aspect-square object-cover" />



                        <h2 class="mt-4 font-black text-lg">

                              {{ item.product.name }}

                        </h2>



                        <p class="font-bold mt-2">

                              {{ price(item.product.price) }}

                        </p>




                        <div class="mt-5 flex justify-between">


                              <button @click="wishlist.remove(item.product_id)" class="text-red-600 font-bold">
                                    Retirer
                              </button>



                              <NuxtLink :to="`/products/${item.product.slug}`" class="font-bold">
                                    Voir
                              </NuxtLink>


                        </div>



                  </div>


            </div>




            <div v-else class="bg-white rounded-[2rem] p-10 text-center">


                  <h2 class="font-black text-xl">
                        Aucun favori
                  </h2>


                  <NuxtLink to="/products" class="inline-flex mt-5 bg-black text-white px-6 py-3 rounded-full">
                        Découvrir les produits
                  </NuxtLink>


            </div>



      </div>


</template>
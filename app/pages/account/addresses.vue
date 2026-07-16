<script setup lang="ts">
import type { AddressForm } from "~/types/customer";

definePageMeta({
      middleware: "sanctum:auth",
      layout: "account",
});

const client = useSanctumClient();
const toast = useToast();

const addresses = ref<any[]>([]);

const loading = ref(false);

const form = reactive<AddressForm>({
      type: "shipping",
      phone: "",
      is_default: false,
      address_line_1: "",
      address_line_2: "",
      city: "",
      state: "",
      postal_code: "",
      country: "Benin",
});

async function loadAddresses() {
      const response: any = await client("/api/v1/customer/addresses");

      addresses.value = response.data ?? [];
}

await loadAddresses();

const formErrors = ref<Record<string, string[]>>({});

async function createAddress() {
      loading.value = true;

      try {
            const response: any = await client("/api/v1/customer/addresses", {
                  method: "POST",
                  body: form,
            });

            addresses.value.unshift(response.data);

            toast.add({
                  title: "Adresse ajoutée",
                  color: "success",
            });

            Object.assign(form, {
                  type: "shipping",
                  phone: "",
                  is_default: false,
                  address_line_1: "",
                  address_line_2: "",
                  city: "",
                  state: "",
                  postal_code: "",
                  country: "Benin",
            });
      } catch (error: any) {
            formErrors.value = error?.data?.errors ?? {};

            toast.add({
                  title: "Impossible d'ajouter l'adresse",
                  description:
                        error?.data?.message ?? "Veuillez vérifier les informations saisies.",
                  color: "error",
            });
      } finally {
            loading.value = false;
      }
}

async function removeAddress(id: string) {
      await client(`/api/v1/customer/addresses/${id}`, {
            method: "DELETE",
      });

      addresses.value = addresses.value.filter((a) => a.id !== id);
}

async function setDefault(id: string) {
      const response: any = await client(
            `/api/v1/customer/addresses/${id}/set-default`,
            {
                  method: "POST",
            },
      );

      await loadAddresses();

      toast.add({
            title: "Adresse principale modifiée",
            color: "success",
      });
}
</script>

<template>
      <div class="space-y-8">
            <!-- Header -->
            <div class="flex items-center justify-between">
                  <div>
                        <h1 class="text-3xl font-black tracking-tight uppercase text-gray-900">
                              Mes adresses
                        </h1>

                        <p class="mt-2 text-sm text-gray-500">
                              Gérez vos adresses de livraison et facturation
                        </p>
                  </div>

                  <div
                        class="hidden md:flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-50 text-brand-600">
                        <Icon name="heroicons:map-pin" class="w-6 h-6" />
                  </div>
            </div>

            <!-- Liste des Adresses Redessinée -->
            <div v-if="addresses.length" class="grid md:grid-cols-2 gap-6">
                  <div v-for="address in addresses" :key="address.id" :class="[
                        'group relative bg-white p-6 transition-all duration-300 ease-out border flex flex-col justify-between',
                        address.is_default
                              ? 'border-brand-500 ring-4 ring-brand-500/10 rounded-3xl shadow-md'
                              : 'border-gray-100 rounded-3xl shadow-sm hover:shadow-md hover:border-gray-200 hover:-translate-y-0.5'
                  ]">

                        <!-- Contenu du haut -->
                        <div>
                              <div class="flex items-start justify-between gap-4">
                                    <div class="flex items-center gap-3">
                                          <div :class="[
                                                'w-10 h-10 rounded-xl flex items-center justify-center transition-colors',
                                                address.is_default ? 'bg-brand-50 text-brand-600' : 'bg-gray-50 text-gray-500 group-hover:bg-gray-100'
                                          ]">
                                                <Icon :name="address.type === 'shipping'
                                                      ? 'heroicons:truck'
                                                      : 'heroicons:document-text'
                                                      " class="w-5 h-5" />
                                          </div>

                                          <div>
                                                <p class="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                                      {{ address.type === "shipping" ? "Livraison" : "Facturation" }}
                                                </p>
                                                <p class="font-extrabold text-sm text-gray-900">Adresse</p>
                                          </div>
                                    </div>

                                    <!-- Badge Principale Épuré -->
                                    <div v-if="address.is_default"
                                          class="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-600 text-white rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm shadow-brand-500/20">
                                          <Icon name="heroicons:check-circle" class="w-3.5 h-3.5" />
                                          Principale
                                    </div>
                              </div>

                              <!-- Infos de l'adresse -->
                              <div class="mt-5 space-y-2 text-sm">
                                    <p class="font-bold text-gray-900 text-base leading-snug">
                                          {{ address.address_line_1 }}
                                    </p>

                                    <p v-if="address.address_line_2" class="text-gray-500 font-medium">
                                          {{ address.address_line_2 }}
                                    </p>

                                    <p class="text-gray-600 font-semibold">
                                          {{ address.city }}<span v-if="address.state">, {{ address.state }}</span>
                                    </p>

                                    <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">
                                          {{ address.country }}
                                    </p>

                                    <!-- Téléphone stylisé -->
                                    <div v-if="address.phone"
                                          class="pt-3 flex items-center gap-2 text-xs text-gray-500 font-medium">
                                          <Icon name="heroicons:phone" class="w-4 h-4 text-gray-400" />
                                          <span>{{ address.phone }}</span>
                                    </div>
                              </div>
                        </div>

                        <!-- Actions du bas -->
                        <div class="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                              <div>
                                    <button v-if="!address.is_default" @click="setDefault(address.id)"
                                          class="inline-flex items-center gap-1 text-xs font-black text-brand-600 hover:text-brand-700 transition-colors uppercase tracking-wider">
                                          <Icon name="heroicons:star" class="w-4 h-4" />
                                          Définir par défaut
                                    </button>

                                    <span v-else
                                          class="inline-flex items-center gap-1 text-xs text-brand-600 font-extrabold uppercase tracking-wider">
                                          <Icon name="heroicons:check" class="w-4 h-4" />
                                          Par défaut
                                    </span>
                              </div>

                              <button @click="removeAddress(address.id)"
                                    class="inline-flex items-center gap-1.5 text-xs font-black text-red-500 hover:text-white hover:bg-red-500 px-3 py-1.5 rounded-xl transition-all uppercase tracking-wider">
                                    <Icon name="heroicons:trash" class="w-4 h-4" />
                                    Supprimer
                              </button>
                        </div>
                  </div>
            </div>

            <!-- Empty State -->
            <div v-else class="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-sm">
                  <div class="w-16 h-16 mx-auto bg-gray-50 text-gray-400 rounded-2xl flex items-center justify-center">
                        <Icon name="heroicons:map-pin" class="w-8 h-8" />
                  </div>

                  <h3 class="mt-4 font-black text-lg text-gray-900">Aucune adresse enregistrée</h3>

                  <p class="text-sm text-gray-500 mt-1">
                        Ajoutez votre première adresse ci-dessous pour commander.
                  </p>
            </div>

            <!-- Ajouter une adresse -->
            <div class="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                  <div class="mb-6">
                        <h2 class="text-xl font-black text-gray-900">Ajouter une adresse</h2>

                        <p class="text-sm text-gray-500 mt-1">
                              Cette adresse pourra être utilisée lors de vos commandes.
                        </p>
                  </div>

                  <form @submit.prevent="createAddress" class="grid md:grid-cols-2 gap-5">
                        <UInput v-model="form.address_line_1" size="lg" placeholder="Adresse complète"
                              icon="heroicons:home" class="md:col-span-2" />

                        <UInput v-model="form.phone" size="lg" placeholder="Téléphone" icon="heroicons:hashtag" />

                        <UInput v-model="form.city" size="lg" placeholder="Ville" icon="heroicons:building-office" />

                        <UInput v-model="form.postal_code" size="lg" placeholder="Code postal"
                              icon="heroicons:hashtag" />

                        <UInput v-model="form.state" size="lg" placeholder="Région / Etat" />

                        <UInput v-model="form.country" size="lg" placeholder="Pays" />

                        <div class="md:col-span-2 flex items-center gap-3">
                              <UCheckbox v-model="form.is_default" label="Définir comme adresse principale" />
                        </div>

                        <div class="md:col-span-2">
                              <UButton type="submit" size="lg" :loading="loading" class="rounded-full px-8 font-bold">
                                    Ajouter l'adresse
                              </UButton>
                        </div>
                  </form>
            </div>
      </div>
</template>

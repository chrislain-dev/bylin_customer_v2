<script setup lang="ts">

definePageMeta({
      middleware: "sanctum:auth",
      layout: "account"
});


const authStore = useAuthStore();

const client = useSanctumClient();

const toast = useToast();


const loading = ref(false);


const form = reactive({

      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      date_of_birth: "",
      gender: ""

});



watch(
      () => authStore.user,
      (user) => {

            if (user) {

                  form.first_name = user.first_name;
                  form.last_name = user.last_name;
                  form.email = user.email;
                  form.phone = user.phone ?? "";
                  form.date_of_birth = user.date_of_birth ?? "";
                  form.gender = user.gender ?? "";

            }

      },
      {
            immediate: true
      });



async function save() {


      loading.value = true;


      try {


            const response: any = await client(
                  "/api/v1/customer/profile",
                  {
                        method: "PUT",
                        body: form
                  }
            );


            await useSanctumAuth()
                  .refreshIdentity();



            toast.add({

                  title: "Profil mis à jour",
                  color: "success"

            });


      } catch (error: any) {

            toast.add({

                  title: "Erreur",
                  description: error?.data?.message,
                  color: "error"

            });


      } finally {

            loading.value = false;

      }

}


</script>



<template>

      <div class="space-y-6 font-syne">


            <h1 class="text-3xl font-black uppercase">
                  Mon Profil
            </h1>


            <div class="bg-white rounded-[2rem] p-8 border border-black/5">


                  <form @submit.prevent="save" class="grid md:grid-cols-2 gap-5">


                        <input v-model="form.first_name" placeholder="Prénom" class="input" />


                        <input v-model="form.last_name" placeholder="Nom" class="input" />


                        <input v-model="form.email" placeholder="Email" class="input" />


                        <input v-model="form.phone" placeholder="Téléphone" class="input" />


                        <input v-model="form.date_of_birth" type="date" class="input" />


                        <select v-model="form.gender" class="input">

                              <option value="">
                                    Genre
                              </option>

                              <option value="male">
                                    Homme
                              </option>

                              <option value="female">
                                    Femme
                              </option>

                              <option value="other">
                                    Autre
                              </option>

                        </select>



                        <div class="md:col-span-2 flex justify-end">

                              <button :disabled="loading" class="rounded-full bg-black text-white px-6 py-3 font-bold">

                                    {{ loading ? "Sauvegarde..." : "Sauvegarder" }}

                              </button>


                        </div>


                  </form>


            </div>

      </div>

</template>
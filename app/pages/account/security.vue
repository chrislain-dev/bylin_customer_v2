<script setup lang="ts">

definePageMeta({
      middleware: "sanctum:auth",
      layout: "account"
});


const client = useSanctumClient();
const toast = useToast();

const loading = ref(false);


const form = reactive({

      current_password: "",
      password: "",
      password_confirmation: ""

});



async function changePassword() {


      loading.value = true;


      try {


            await client(
                  "/api/v1/customer/profile/change-password",
                  {
                        method: "POST",
                        body: form
                  }
            );



            toast.add({

                  title: "Mot de passe modifié",
                  description: "Votre mot de passe a été mis à jour",
                  color: "success"

            });



            form.current_password = "";
            form.password = "";
            form.password_confirmation = "";



      } catch (error: any) {


            toast.add({

                  title: "Erreur",
                  description: error?.data?.message ?? "Impossible de modifier le mot de passe",
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
                  Sécurité
            </h1>



            <div class="bg-white rounded-[2rem] p-8 border border-black/5 max-w-xl">


                  <form @submit.prevent="changePassword" class="space-y-5">


                        <div>

                              <label class="text-sm font-bold">
                                    Mot de passe actuel
                              </label>


                              <input v-model="form.current_password" type="password" class="input mt-2" />

                        </div>



                        <div>

                              <label class="text-sm font-bold">
                                    Nouveau mot de passe
                              </label>


                              <input v-model="form.password" type="password" class="input mt-2" />

                        </div>



                        <div>

                              <label class="text-sm font-bold">
                                    Confirmation
                              </label>


                              <input v-model="form.password_confirmation" type="password" class="input mt-2" />

                        </div>




                        <button :disabled="loading" class="rounded-full bg-black px-6 py-3 text-white font-bold">

                              {{ loading ? "Modification..." : "Modifier" }}

                        </button>



                  </form>


            </div>


      </div>

</template>
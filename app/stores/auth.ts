// stores/auth.ts
import { defineStore } from "pinia";
import type { Customer } from "~/types/customer";

export const useAuthStore = defineStore("auth", () => {
  const {
    user: sanctumUser,
    login: sanctumLogin,
    logout: sanctumLogout,
  } = useSanctumAuth();
  const toast = useToast();
  const router = useRouter();

  const user = computed(() => sanctumUser.value as Customer | null);
  const isAuthenticated = computed(() => !!user.value);
  const loading = ref(false);

  async function login(credentials: { email: string; password: string }) {
    loading.value = true;
    try {
      await sanctumLogin(credentials);

      console.log("Logged in user:", sanctumUser.value);

      toast.add({
        title: "Connexion réussie",
        description: `Bienvenue ${user.value?.first_name}!`,
        color: "success",
        icon: "i-heroicons-check-circle",
      });

      router.push("/");
    } catch (error: any) {
      const message = error?.data?.message || "Identifiants incorrects";

      toast.add({
        title: "Erreur de connexion",
        description: message,
        color: "error",
        icon: "i-heroicons-x-circle",
      });
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function register(data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
    phone?: string;
  }) {
    loading.value = true;
    const client = useSanctumClient();

    try {
      await client("/api/v1/auth/customer/register", {
        method: "POST",
        body: data,
      });

      // Auto-login après inscription
      await login({
        email: data.email,
        password: data.password,
      });

      toast.add({
        title: "Inscription réussie",
        description: "Bienvenue sur Bylin!",
        color: "success",
        icon: "i-heroicons-check-circle",
      });
    } catch (error: any) {
      const message = error?.data?.message || "Une erreur est survenue";

      toast.add({
        title: "Erreur d'inscription",
        description: message,
        color: "error",
        icon: "i-heroicons-x-circle",
      });
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function loginWithGoogle(credential: string) {
    loading.value = true;
    const client = useSanctumClient();

    try {
      // First, get CSRF cookie for stateful authentication
      await client("/sanctum/csrf-cookie");
      
      const response = await client("/api/v1/auth/customer/google/id-token", {
        method: "POST",
        body: { credential },
      });

      // Refresh user state after successful login
      await useSanctumAuth().refreshIdentity();

      toast.add({
        title: "Connexion réussie",
        description: `Bienvenue ${response.data?.customer?.first_name || 'chez Bylin'}!`,
        color: "success",
        icon: "i-heroicons-check-circle",
      });

      router.push("/account");
    } catch (error: any) {
      const message = error?.data?.message || "Impossible de se connecter avec Google";
      toast.add({
        title: "Erreur Google",
        description: message,
        color: "error",
        icon: "i-heroicons-x-circle",
      });
      throw error;
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    loading.value = true;
    try {
      await sanctumLogout();

      // Clear stores
      const cartStore = useCartStore();
      const wishlistStore = useWishlistStore();
      cartStore.clear();
      wishlistStore.clear();

      toast.add({
        title: "Déconnexion réussie",
        description: "À bientôt!",
        color: "success",
      });

      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      loading.value = false;
    }
  }

  return {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
  };
});

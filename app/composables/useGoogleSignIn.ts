// composables/useGoogleSignIn.ts
//
// Intégration directe du SDK "Google Identity Services", sans dépendre
// d'un module tiers (nuxt-vue3-google-signin / vue3-google-signin).
//
// Pourquoi ce choix :
// - Le module tiers ignore silencieusement un client_id manquant
//   (console.warn + return, sans jamais appeler app.use()), mais le
//   composant <GoogleSignInButton> reste tout de même rendu et finit
//   par appeler google.accounts.id.initialize({ client_id: undefined }),
//   ce qui fait planter le SDK Google en profondeur — exactement l'erreur
//   minifiée observée en production.
// - Cette implémentation valide le client_id AVANT tout appel au SDK
//   Google et ne laisse jamais une erreur silencieuse remonter comme
//   une exception non gérée.

let googleScriptPromise: Promise<void> | null = null;

function loadGoogleScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.resolve();
  }

  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  if (googleScriptPromise) {
    return googleScriptPromise;
  }

  googleScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-google-gsi="true"]'
    );

    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () =>
        reject(new Error("Impossible de charger le script Google Sign-In"))
      );
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.dataset.googleGsi = "true";
    script.onload = () => resolve();
    script.onerror = () => {
      googleScriptPromise = null; // permettre un nouvel essai
      reject(new Error("Impossible de charger le script Google Sign-In"));
    };
    document.head.appendChild(script);
  });

  return googleScriptPromise;
}

export const useGoogleSignIn = () => {
  const config = useRuntimeConfig();
  const clientId = config.public.googleClientId as string;

  const isReady = ref(false);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  /**
   * Initialise le SDK Google et rend le bouton officiel dans `target`.
   * Ne lève jamais d'exception : les erreurs sont exposées via `onError`.
   */
  async function renderButton(
    target: HTMLElement,
    onSuccess: (credential: string) => void,
    onError: (message: string) => void,
    buttonConfig: Partial<{
      type: "standard" | "icon";
      theme: "outline" | "filled_blue" | "filled_black";
      size: "large" | "medium" | "small";
      text: "signin_with" | "signup_with" | "continue_with" | "signin";
      shape: "rectangular" | "pill" | "circle" | "square";
      logo_alignment: "left" | "center";
    }> = {}
  ) {
    if (!clientId) {
      const message =
        "Connexion Google indisponible pour le moment (configuration manquante).";
      error.value = message;
      // eslint-disable-next-line no-console
      console.error(
        "[useGoogleSignIn] NUXT_PUBLIC_GOOGLE_CLIENT_ID est vide. " +
          "Vérifiez la variable d'environnement au moment du build."
      );
      onError(message);
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      await loadGoogleScript();

      if (!window.google?.accounts?.id) {
        throw new Error("Le SDK Google Sign-In ne s'est pas chargé correctement");
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: (response) => {
          if (response?.credential) {
            onSuccess(response.credential);
          } else {
            onError("Aucune information reçue de Google. Veuillez réessayer.");
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      window.google.accounts.id.renderButton(target, {
        type: "standard",
        theme: "filled_black",
        size: "large",
        text: "continue_with",
        shape: "rectangular",
        logo_alignment: "left",
        ...buttonConfig,
      });

      isReady.value = true;
    } catch (e: any) {
      const message =
        e?.message || "Impossible d'initialiser la connexion Google";
      error.value = message;
      onError(message);
    } finally {
      isLoading.value = false;
    }
  }

  function cancel() {
    if (typeof window !== "undefined" && window.google?.accounts?.id) {
      window.google.accounts.id.cancel();
    }
  }

  return {
    isReady,
    isLoading,
    error,
    renderButton,
    cancel,
  };
};

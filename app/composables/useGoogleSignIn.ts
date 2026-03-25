// composables/useGoogleSignIn.ts
export const useGoogleSignIn = () => {
  const config = useRuntimeConfig();
  const isReady = ref(false);

  // Vérifier si le script Google est chargé
  onMounted(() => {
    if (typeof window !== "undefined" && window.google) {
      isReady.value = true;
    }
  });

  /**
   * Déclencher la popup de connexion Google
   */
  const login = async (): Promise<{ credential?: string } | null> => {
    return new Promise((resolve, reject) => {
      if (!window.google || !window.google.accounts) {
        reject(new Error("Google Sign-In not loaded"));
        return;
      }

      window.google.accounts.id.initialize({
        client_id: config.public.googleClientId as string,
        callback: (response: any) => {
          if (response.credential) {
            resolve({ credential: response.credential });
          } else {
            reject(new Error("No credential received"));
          }
        },
      });

      // Afficher la popup
      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          reject(new Error("Google Sign-In popup not displayed"));
        }
      });
    });
  };

  return {
    isReady,
    login,
  };
};

/**
 * Construit l'URL correcte pour appeler l'API Laravel selon le contexte :
 *
 * - Côté serveur (SSR) : URL absolue interne (`apiSecretUrl`) → appel direct
 *   serveur-à-serveur, pas de CORS.
 * - Côté client (navigateur) : chemin RELATIF (`/api/v1/...`) → la requête passe
 *   par le proxy Nitro (devProxy en dev, routeRules proxy en prod), donc reste
 *   en same-origin et n'est jamais bloquée par le CORS.
 *
 * C'est ce qui corrige le bug « rien ne charge quand on navigue sans refresh » :
 * au premier chargement le SSR récupérait les données côté serveur, mais en
 * navigation SPA le navigateur appelait https://api.bylin-style.com directement
 * et se faisait bloquer par le CORS.
 */
export const useApiUrl = () => {
  const config = useRuntimeConfig();

  const apiUrl = (path: string): string => {
    if (import.meta.server) {
      return `${config.apiSecretUrl}${path}`;
    }
    return path;
  };

  return { apiUrl };
};

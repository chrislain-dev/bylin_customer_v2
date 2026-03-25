export default defineAppConfig({
  googleSignIn: {
    clientId:
      process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID ||"",
  },
});

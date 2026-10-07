import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

/**
 * Politique de sécurité du contenu, ajoutée au build de production : le site ne
 * charge que ses propres scripts, Google Fonts et l'API. L'en-tête frame-ancestors
 * (anti-clickjacking) ne peut pas passer par une balise meta : il est posé par le serveur.
 */
function politiqueDeSecurite(urlApi: string): Plugin {
  const api = urlApi ? new URL(urlApi).origin : "";
  const csp = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: blob: https:",
    `connect-src 'self'${api ? ` ${api}` : ""}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    ...(api.startsWith("https:") ? ["upgrade-insecure-requests"] : []),
  ].join("; ");
  return {
    name: "fidelem-politique-de-securite",
    apply: "build",
    transformIndexHtml: (html) => html.replace("<head>", `<head>\n    <meta http-equiv="Content-Security-Policy" content="${csp}" />`),
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    server: {
      // Uniquement sur cette machine ; `npm run dev -- --host` pour tester depuis un téléphone.
      host: "localhost",
      port: 8080,
    },
    plugins: [react(), politiqueDeSecurite(env.VITE_API_URL ?? "")],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});

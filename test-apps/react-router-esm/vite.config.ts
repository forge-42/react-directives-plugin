
import { defineConfig } from "vite";
import { reactDirectives } from "react-directives-plugin";
import { reactRouterDevTools } from "react-router-devtools"
import { reactRouter } from "@react-router/dev/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    reactDirectives({
      "use server": ["**/*.server.ts"],
      "use client": ["**/*.client.ts"],
      "use strict": ["**/*.strict.ts"],
    }),
    reactRouterDevTools(),reactRouter(), tsconfigPaths()
  ],
});

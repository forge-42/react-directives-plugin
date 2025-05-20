
import { defineConfig } from "vite";
import { reactDirectives } from "vite-plugin-react-directives";

export default defineConfig({
  plugins: [
    reactDirectives({
      "use server": ["**/*.server.ts"],
      "use client": ["**/*.client.ts"],
      "use strict": ["**/*.strict.ts"],
    })
  ],
});

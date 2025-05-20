# vite-plugin-react-directives


![GitHub Repo stars](https://img.shields.io/github/stars/forge-42/vite-plugin-react-directives?style=social)
![npm](https://img.shields.io/npm/v/vite-plugin-react-directives?style=plastic)
![GitHub](https://img.shields.io/github/license/forge-42/vite-plugin-react-directives?style=plastic)
![npm](https://img.shields.io/npm/dy/vite-plugin-react-directives?style=plastic)
![npm](https://img.shields.io/npm/dw/vite-plugin-react-directives?style=plastic)
![GitHub top language](https://img.shields.io/github/languages/top/forge-42/vite-plugin-react-directives?style=plastic)

vite-plugin-react-directives is a vite plugin that allows you to add directives on top of files matched by patterns you
provide. Do not forget to add a `"use server"`, `"use client"` or `"use strict"` directive to the top of your file ever again!

## Installation

```bash
npm install -D vite-plugin-react-directives
```

## Usage

```ts
import { reactDirectives } from "vite-plugin-react-directives";

export default defineConfig({
  plugins: [
    reactDirectives({
      // Adds a "use server" directive to all files that end with .server.ts
      "use server": ["**/*.server.ts"],
      // Adds a "use client" directive to all files that end with .client.ts
      "use client": ["**/*.client.ts"],
      // Adds a "use strict" directive to all files that end with .strict.ts
      "use strict": ["**/*.strict.ts"],
    })
  ],
});
```

### Config options

| Option | Type | Description |
|--------|------|-------------|
| `use server` | `string[]` | An array of glob patterns to match files to add the `"use server"` directive. |
| `use client` | `string[]` | An array of glob patterns to match files to add the `"use client"` directive. |
| `use strict` | `string[]` | An array of glob patterns to match files to add the `"use strict"` directive. |

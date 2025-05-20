import type { Plugin } from "vite"
import { transformCode } from "./transformer"

// This is your packages entry point, everything exported from here will be accessible to the end-user.
export const reactDirectives = (props?: {
	"use strict"?: string[]
	"use server"?: string[]
	"use client"?: string[]
	// biome-ignore lint/suspicious/noExplicitAny: Avoid issues with vite-plugin types
}): any => {
	const { "use client": useClient = [], "use server": useServer = [], "use strict": useStrict = [] } = props || {}
	return {
		name: "react-directives-plugin",
		enforce: "pre",
		transform(code, id) {
			return transformCode(code, id, {
				useClient,
				useServer,
				useStrict,
			})
		},
	} satisfies Plugin
}

import type { Plugin } from "vite"
import { transformCode } from "./transformer"

export interface ReactDirectivesPluginOptions {
	"use strict"?: string[]
	"use server"?: string[]
	"use client"?: string[]
	[key: `use ${string}`]: string[] | undefined
}

// This is your packages entry point, everything exported from here will be accessible to the end-user.
export const reactDirectives = (
	props?: ReactDirectivesPluginOptions
	// biome-ignore lint/suspicious/noExplicitAny: Avoid issues with vite-plugin types
): any => {
	return {
		name: "react-directives-plugin",
		enforce: "pre",
		transform(code, id) {
			return transformCode(code, id, props)
		},
	} satisfies Plugin
}

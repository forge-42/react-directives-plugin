import type { types as Babel } from "@babel/core"
import type { ParseResult } from "@babel/parser"
import picomatch from "picomatch"
import { gen, parse, t } from "./babel"

const transform = (ast: ParseResult<Babel.File>, directivesToAdd: string[]) => {
	if (!directivesToAdd.length) {
		return false
	}

	for (const directive of directivesToAdd) {
		ast.program.body.unshift(t.expressionStatement(t.stringLiteral(directive)))
	}

	return true
}

export function addReactDirectives(code: string, directivesToAdd: string[], id: string) {
	const [filePath] = id.split("?")
	try {
		const ast = parse(code, { sourceType: "module" })
		const nonExistingDirectives = directivesToAdd.filter((directive) => {
			const directiveString = `"${directive}"`
			if (code.includes(directiveString)) {
				return false
			}
			return true
		})

		const didTransform = transform(ast, nonExistingDirectives)
		if (!didTransform) {
			return { code }
		}
		return gen(ast, { sourceMaps: true, filename: id, sourceFileName: filePath })
	} catch (_e) {
		return { code }
	}
}

export const transformCode = (
	code: string,
	id: string,
	{
		useClient,
		useServer,
		useStrict,
	}: {
		useClient: string[]
		useServer: string[]
		useStrict: string[]
	}
) => {
	const directivesToAdd = []
	const clientMatcher = picomatch(useClient)
	const serverMatcher = picomatch(useServer)
	const strictMatcher = picomatch(useStrict)
	if (clientMatcher(id)) {
		directivesToAdd.push("use client")
	}
	if (serverMatcher(id)) {
		directivesToAdd.push("use server")
	}
	if (strictMatcher(id)) {
		directivesToAdd.push("use strict")
	}
	if (!directivesToAdd.length) {
		return { code }
	}

	return addReactDirectives(code, directivesToAdd, id)
}

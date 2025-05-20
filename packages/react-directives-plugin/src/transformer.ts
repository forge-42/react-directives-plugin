import type { types as Babel } from "@babel/core"
import type { ParseResult } from "@babel/parser"
import picomatch from "picomatch"
import type { ReactDirectivesPluginOptions } from "."
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

export const transformCode = (code: string, id: string, directives?: ReactDirectivesPluginOptions) => {
	if (!directives) {
		return { code }
	}
	const directivesToAdd = []
	for (const [key, value] of Object.entries(directives)) {
		const matcher = picomatch(value)
		if (matcher(id)) {
			directivesToAdd.push(key)
		}
	}

	if (!directivesToAdd.length) {
		return { code }
	}

	return addReactDirectives(code, directivesToAdd, id)
}

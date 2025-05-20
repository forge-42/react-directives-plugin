import { addReactDirectives, transformCode } from "./transformer"
const removeWhitespace = (str: string) => str.replace(/\s/g, "")
describe("addReactDirectives", () => {
	it("should add directives to the top of the file", () => {
		const code = "const a = 1;"
		const directivesToAdd = ["use client", "use server"]
		const id = "test.js"
		const result = addReactDirectives(code, directivesToAdd, id)
		expect(removeWhitespace(result.code)).toMatch(
			removeWhitespace(`
			"use server";
			"use client";
			const a = 1;
			`)
		)
	})

	it("should not add directives to the top of the file if they exist", () => {
		const code = `
		"use server";
		"use strict";
		const a = 1;
		`
		const directivesToAdd = ["use client", "use server"]
		const id = "test.js"
		const result = addReactDirectives(code, directivesToAdd, id)

		expect(removeWhitespace(result.code)).toEqual(
			removeWhitespace(`
			"use server";
			"use strict";
			"use client";
			const a = 1;
			`)
		)
	})

	it("should not add directives if none are provided", () => {
		const code = "const a = 1;"
		const directivesToAdd: string[] = []
		const id = "test.js"
		const result = addReactDirectives(code, directivesToAdd, id)
		expect(result.code).toBe(code)
	})
})

describe("transformCode", () => {
	it("should add client directive with single matcher", () => {
		const code = "const a = 1;"
		const id = "C://path/to/file/test.js"
		const result = transformCode(code, id, {
			"use client": ["**/*.js"],
			"use server": [],
			"use strict": [],
		})
		expect(removeWhitespace(result.code)).toMatch(
			removeWhitespace(`
			"use client";
			const a = 1;
			`)
		)
	})
	it("should add client directive with multiple matchers", () => {
		const code = "const a = 1;"
		const id = "C://path/to/file/test.js"
		const result = transformCode(code, id, {
			"use client": ["*/.ts", "**/*.js"],
			"use server": [],
			"use strict": [],
		})
		expect(removeWhitespace(result.code)).toMatch(
			removeWhitespace(`
			"use client";
			const a = 1;
			`)
		)
	})
	it("should not add server directive with multiple matchers if they don't match", () => {
		const code = "const a = 1;"
		const id = "C://path/to/file/test.js"
		const result = transformCode(code, id, {
			"use client": [],
			"use server": ["*/.ts", "**/*.ts"],
			"use strict": [],
		})
		expect(removeWhitespace(result.code)).toMatch(
			removeWhitespace(`
			const a = 1;
			`)
		)
	})

	it("should add server directive with single matcher", () => {
		const code = "const a = 1;"
		const id = "C://path/to/file/test.js"
		const result = transformCode(code, id, {
			"use client": [],
			"use server": ["**/*.js"],
			"use strict": [],
		})
		expect(removeWhitespace(result.code)).toMatch(
			removeWhitespace(`
			"use server";
			const a = 1;
			`)
		)
	})

	it("should add server directive with single matcher with suffix", () => {
		const code = "const a = 1;"
		const id = "C://path/to/file/test.server.js"
		const result = transformCode(code, id, {
			"use client": [],
			"use server": ["**/*.server.js"],
			"use strict": [],
		})
		expect(removeWhitespace(result.code)).toMatch(
			removeWhitespace(`
			"use server";
			const a = 1;
			`)
		)
	})
	it("should add server directive with multiple matchers", () => {
		const code = "const a = 1;"
		const id = "C://path/to/file/test.js"
		const result = transformCode(code, id, {
			"use client": [],
			"use server": ["*/.ts", "**/*.js"],
			"use strict": [],
		})
		expect(removeWhitespace(result.code)).toMatch(
			removeWhitespace(`
			"use server";
			const a = 1;
			`)
		)
	})
	it("should not add server directive with multiple matchers if they don't match", () => {
		const code = "const a = 1;"
		const id = "C://path/to/file/test.js"
		const result = transformCode(code, id, {
			"use client": [],
			"use server": ["*/.ts", "**/*.ts"],
			"use strict": [],
		})
		expect(removeWhitespace(result.code)).toMatch(
			removeWhitespace(`

			const a = 1;
			`)
		)
	})

	it("should not add strict directive with multiple matchers if they don't match", () => {
		const code = "const a = 1;"
		const id = "C://path/to/file/test.js"
		const result = transformCode(code, id, {
			"use client": [],
			"use server": [],
			"use strict": ["*/.ts", "**/*.ts"],
		})
		expect(removeWhitespace(result.code)).toMatch(
			removeWhitespace(`
			const a = 1;
			`)
		)
	})

	it("should add strict directive with single matcher", () => {
		const code = "const a = 1;"
		const id = "C://path/to/file/test.js"
		const result = transformCode(code, id, {
			"use client": [],
			"use server": [],
			"use strict": ["**/*.js"],
		})
		expect(removeWhitespace(result.code)).toMatch(
			removeWhitespace(`
			"use strict";
			const a = 1;
			`)
		)
	})
	it("should add strict directive with multiple matchers", () => {
		const code = "const a = 1;"
		const id = "C://path/to/file/test.js"
		const result = transformCode(code, id, {
			"use client": [],
			"use server": [],
			"use strict": ["*/.ts", "**/*.js"],
		})
		expect(removeWhitespace(result.code)).toMatch(
			removeWhitespace(`
			"use strict";
			const a = 1;
			`)
		)
	})

	it("should add random directive with multiple matchers", () => {
		const code = "const a = 1;"
		const id = "C://path/to/file/test.js"
		const result = transformCode(code, id, {
			"use client": [],
			"use server": [],
			"use strict": ["*/.ts", "**/*.js"],
			"use potato": ["*/.ts", "**/*.js"],
		})
		expect(removeWhitespace(result.code)).toMatch(
			removeWhitespace(`
			"use potato";
			"use strict";
			const a = 1;
			`)
		)
	})
	it("should not add strict directive with multiple matchers if they don't match", () => {
		const code = "const a = 1;"
		const id = "C://path/to/file/test.js"
		const result = transformCode(code, id, {
			"use client": [],
			"use server": [],
			"use strict": ["*/.ts", "**/*.ts"],
		})
		expect(removeWhitespace(result.code)).toMatch(
			removeWhitespace(`

			const a = 1;
			`)
		)
	})
})

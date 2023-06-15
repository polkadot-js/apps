// filename: inlang.config.js
export async function defineConfig(env) {
	const { default: pluginJson } = await env.$import(
		"https://cdn.jsdelivr.net/gh/samuelstroschein/inlang-plugin-json@2/dist/index.js",
	)

	// recommended to enable linting feature
	const { default: standardLintRules } = await env.$import(
		"https://cdn.jsdelivr.net/gh/inlang/standard-lint-rules@2/dist/index.js",
	)

	return {
		referenceLanguage: "en",
		plugins: [
			pluginJson({
				pathPattern: ".example/{language}.json",
			}),
			standardLintRules(),
		],
	}
}

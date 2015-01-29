BkUtils =
	generateToLegacyModelMethod: (klassName) ->
		return ->
			BalancedApp.__container__.lookupFactory("model:#{klassName}").find(@get("href"))
`export default BkUtils;`

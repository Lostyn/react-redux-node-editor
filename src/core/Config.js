const Config = {
	nodes: [{
		type: "text",
		name: "Texte",
		fields: {
			in: [{
				name: "from"
			}],
			out: [{
				name: "to"
			}]
		}
	}, {
		type: "choice",
		name: "Choix",
		fields: {
			in: [{
				name: "from"
			}],
			out: [{
				name: "1"
			}]
		}
	}]
}

export default Config;
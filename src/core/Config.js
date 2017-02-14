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
		},
		value: "",
		adds:{}
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
		},
		value: "",
		adds:{}
	}]
}

export default Config;
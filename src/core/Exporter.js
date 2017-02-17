import {remote} from 'electron';
import storage from '../utils/storage';

export function exportFile(editor) {
	var exp = {
		nodes: []
	}

	editor.nodes.map( o => {
		var n = {
			id: o.nid,
			type: o.type,
		}

		switch(o.type) {
			case "start":
				exp.nodes.push(Object.assign({}, n, {
					next: getNext(o.fields.out[0], editor)
				}));
				break;
			case "choice":
				exp.nodes.push(Object.assign({}, n, {
					values: o.fields.out.map( o => {
						return {
							label: o.name,
							to: getNext(o, editor)
						}
					}),
					...o.adds
				}));
				break;
			case "text":
				exp.nodes.push(Object.assign({}, n, {
					values: o.value,
					next: getNext(o.fields.out[0], editor),
					...o.adds
				}));
				break;
		}
	});

	const path = remote.dialog.showSaveDialog({properties: ['ExportFile'], filters: [
    	{name: 'Json', extensions: ['json']}
	]});
	storage.set(path, exp)
		.then( () => {
			console.log("file saved");
		})
		.catch( err => {
			console.log("save file error", err);
		})
}

const getNext = (out, editor) => {
	const next = editor.connections.find( o => o.from == out.id);
	if (next)
		return next.to_node;

	return 0;
}
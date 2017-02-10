import fs from 'fs'
import path from 'path';
import mkdirp from 'mkdirp';

function _get(filePath, cb) {
	return fs.readFile(filePath, {encoding: 'utf8'}, (err, json) => {
		if(!err) {
			return cb(null, JSON.parse(json));
		}

		if(err.code === 'ENOENT')
			err.message = `The file in path ${filePath} doesn\'t exist`;

		return cb(err);
	});
}

function get(filePath) {
	return new Promise((resolve, reject) => 
		_get(filePath, (err, data) => {
			if (err) return reject(err);
			return resolve(data);
		})
	);
}

function _set(filePath, data, cb) {
	const json = JSON.stringify(data);

	if (typeof json == "undefined")
		return cb(`The file you trying to save at path ${filePath} is not valid json`);

	const dir = path.dirname(filePath);

	return fs.access(dir, fs.F_OK, (notExists) => {
		if (!notExists) return fs.writeFile(filePath, json, cb);
		return mkdirp(dir, (err) => {
			if (err) return cb(err);
			return fs.writeFile(filePath, json, cb);
		});
	});
}



function set(filePath, data) {
	return new Promise((resolve, reject) =>
		_set(filePath, data, (err) => {
			if(err) return reject(err);
			return resolve();
		})
	);
}


module.exports = {
	get,
	set
}
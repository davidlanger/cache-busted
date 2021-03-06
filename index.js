var cacheBust = module.exports = function cacheBust (options) {
	var defaults = {
		version: null,
		packageLocation: __dirname + '/../../package.json'
	};

	options = options ? {
		version: options.version || defaults.version,
		packageLocation: options.packageLocation || defaults.packageLocation
	} : defaults;

	if (!options.version) {
		try {
			options.version = require(options.packageLocation).version;
		} catch(e) {
			throw(new Error('No version information found. Looked in ' + options.packageLocation));
		}
	}

	var querystring;
	if (process.env.NODE_ENV === 'production') {
		querystring = options.version;
	} else {
		querystring = options.version + '-' + cacheBust.getTimestamp();
	}

	return function (ressource, type) {
		type = type || getType(ressource);
		if (type === 'js' || type === 'jsx') {
			return '<script src="' + ressource + '?v=' + querystring + '"></script>';
		} else if (type === 'css') {
			return '<link rel="stylesheet" href="' + ressource + '?v=' + querystring + '" />';
		} else {
			throw new Error('Unknown extension, currently only css, js and jsx are automatically recognized. When using another extension specify either js or css as the second parameter')
		}
	};
};

cacheBust.handler = function handler (app, options) {
	app.locals.cacheBust = cacheBust(options);
};

cacheBust.getTimestamp = function getTimestamp () {
	return new Date().valueOf();
};

function getType (ressource) {
	var extension = ressource.split('.').pop();
	return extension;
}

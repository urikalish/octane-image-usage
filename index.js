'use strict';
const _ = require('lodash');
const fs = require('fs');

const basePath = `C:/QC/Views/Git/mqm/UI/mqm-web-ui/`;
const searchPath = basePath + 'app/ui/';
const imagesPath = basePath + 'target/stylebox/build/assets/icons/';

const getFiles = (dir, files) => {
	fs.readdirSync(dir).forEach(file => {
		const fullName = dir + file;
		if (fs.statSync(fullName).isDirectory()) {
			if (!fullName.endsWith('/lib') && !fullName.endsWith('/generated')) {
			files = getFiles(fullName + '/', files);
			}
		} else if (file.endsWith('.html') || file.endsWith('.less') || file.endsWith('.css') || file.endsWith('.js') || file.endsWith('.ts')) {
			//console.log(fullName);
			files.push(fullName);
		}
	});
	return files;
};

const getImageNames = (dir) => {
	let imageNames = [];
	fs.readdirSync(dir).forEach(file => {
		const imageName = file.substr(0, file.length-4);
		//console.log(imageName);
		imageNames.push(imageName);
	});
	return imageNames;
};

const checkImageUsage = (imageName, fileName, fileText) => {
	let found = false;
	if (fileName.endsWith('.html')) {
		found = fileText.match(new RegExp(`(name|icon)="${imageName}"`, 'gm'));
	} else if (fileName.endsWith('.less') || fileName.endsWith('.css')) {
		found = fileText.match(new RegExp(`${imageName}.svg`, 'gm'));
	} else if (fileName.endsWith('.js') || fileName.endsWith('.ts')) {
		found = fileText.match(new RegExp(`'${imageName}'`, 'gm'));
	}
	return found;
};

const checkUsage = (relevantFiles, imageNames) => {
	const result = {};
	imageNames.forEach(imageName => {
		result[imageName] = [];
	});
	relevantFiles.forEach(fileName => {
		const data = fs.readFileSync(fileName).toString();
		imageNames.forEach(imageName => {
			if (checkImageUsage(imageName, fileName, data)) {
				result[imageName].push(fileName);
			}
		});
	});
	return result;
};

const generateUsageReport = () => {
	const relevantFiles = getFiles(searchPath, []);
	console.log(`${relevantFiles.length} relevant files`);
	const imageNames = getImageNames(imagesPath);
	console.log(`${imageNames.length} image names`);
	let result = checkUsage(relevantFiles, imageNames);
	let output = [];
	_.keys(result).forEach(k => {
		output.push(`${result[k].length < 10 ? '0' : ''}${result[k].length} ${k}`);
	});
	output.sort();
	output.forEach(o => {
		console.log(o);
	});
};

const generateSvgImports = () => {
	const dir = basePath + 'app/ui/platform/assets/images/icons/';
	fs.readdirSync(dir).forEach(file => {
		console.log(`import 'platform/assets/images/icons/${file}';`);
	});
};

generateUsageReport();
//generateSvgImports();

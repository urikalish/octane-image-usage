'use strict';
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

const checkImageUsage = (imageName, relevantFiles) => {
	let found = false;
	for (let i = 0; i < relevantFiles.length; i++) {
		const fileName = relevantFiles[i];
		const data = fs.readFileSync(fileName).toString();
		if (fileName.endsWith('.html')) {
			found = data.match(new RegExp(`(name|icon)="${imageName}"`, 'gm'));
		} else if (fileName.endsWith('.less') || fileName.endsWith('.css')) {
			found = data.match(new RegExp(`${imageName}.svg`, 'gm'));
		} else if (fileName.endsWith('.js') || fileName.endsWith('.ts')) {
			found = data.match(new RegExp(`'${imageName}'`, 'gm'));
		}
		if (found) {
			console.log(`+ ${imageName} (${fileName})`);
			break;
		}
	}
	if (!found) {
		console.error(`- ${imageName}`);
	}
};

// var replaceText = function(fullFileName) {
// 	var result = '';
// 	fs.readFile(fullFileName, 'utf8', function (err, data) {
// 		if (err) {
// 			return console.log(err);
// 		}
// 		if (data.match(/( !important;)/gm)) {
// 			count++;
// 			console.log(
// 			'\n----------------------------------------------------------------------------------------------------\n' +
// 			'(' + count + ' )' + fullFileName +
// 			'\n----------------------------------------------------------------------------------------------------\n');
//
// 			result = data.replace(/^([ \t]+)([a-zA-Z0-9:.\-%@#~"(){} \t]+)( !important;)$/gm, '$1' + prevLine + '\n$1$2$3\n' + '$1' + nextLine);
//
// 			console.log(result);
//
// 			fs.writeFile(fullFileName, result, 'utf8', function (err) {
// 				if (err) {
// 					return console.log(err);
// 				}
// 			});
//
// 		}
// 	});
// };

const imageNames = getImageNames(imagesPath);
const relevantFiles = getFiles(searchPath, []);
console.log(`${imageNames.length} image names`);
console.log(`${relevantFiles.length} relevant files`);
imageNames.forEach(imageName => {
 	checkImageUsage(imageName, relevantFiles);
});

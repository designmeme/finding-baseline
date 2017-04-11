/*
 * Process data
 * input: /data/googleFonts.json, /data/baseline.json
 * output: /data/fonts.json, /data/fonts.yml, /docs/_data/fonts.yml
 */

var fs = require('fs');
var YAML = require('yamljs');
var dir = __dirname + '/../data';
var dataFontsOriginal =  dir + '/googleFonts.json';
var dataBaselineOriginal =  dir + '/baseline.json';
var dataJson = dir + '/fonts.json';
var dataYml = dir + '/fonts.yml';
var docsDataYml = __dirname + '/../docs/_data/fonts.yml';
var fonts = [];
var baseline;

fs.readFile(dataFontsOriginal, 'utf8', function (err, data) {
  if (err) throw err;

  data = JSON.parse(data).items;
  baseline = JSON.parse(fs.readFileSync(dataBaselineOriginal, 'utf8'));

  data.forEach(function (val, index) {
    fonts[index] = {
      'family': val.family,
      'category': val.category,
      'baseline-ratio': baseline[val.family]
    }
  });

  fs.writeFile(dataJson, JSON.stringify(fonts, null, 2), 'utf8', function (err) {
    if(err) throw err;
  });

  fs.writeFile(dataYml, YAML.stringify(fonts, 2), 'utf8', function (err) {
    if(err) throw err;
  });

  fs.writeFile(docsDataYml, YAML.stringify(fonts, 2), 'utf8', function (err) {
    if(err) throw err;
  });

});

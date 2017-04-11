/*
 * Save google fonts data to '/data/googleFonts.json'
 */

var fs = require('fs');
var request = require('request');
var sort = 'popularity'; // alpha | date | popularity | style | trending
var apiKey = 'AIzaSyD0z0akKgVwTUd2z3Y_HLmP6rcaxbiq2wg'; // API key
var url = 'https://www.googleapis.com/webfonts/v1/webfonts?key=' + apiKey + '&sort=' + sort;
var dir = __dirname + '/../data';
var dataFontsOriginal =  dir + '/googleFonts.json';
var dataBaselineOriginal =  dir + '/baseline.json';
var baseline = {};

request.get({
  url: url,
  json: true,
  headers: {'User-Agent': 'request'}
}, function (err, res, data) {
  if (err) {
    console.log('Error:', err);
  } else if (res.statusCode !== 200) {
  console.log('Status:', res.statusCode);
  } else {
    fs.writeFile(dataFontsOriginal, JSON.stringify(data, null, 2), 'utf8', function (err) {
      if(err) throw err;
    });

    if (!fs.existsSync(dataBaselineOriginal)) {
      data = data.items;

      data.forEach(function (val) {
        baseline[val.family] = ''
      });
      fs.writeFile(dataBaselineOriginal, JSON.stringify(baseline, null, 2), 'utf8', function (err) {
        if(err) throw err;
      });
    }
  }
});
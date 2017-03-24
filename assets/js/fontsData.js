var apiKey = 'AIzaSyD0z0akKgVwTUd2z3Y_HLmP6rcaxbiq2wg'; // API key
var apiUrl = 'https://www.googleapis.com/webfonts/v1/webfonts?key=' + apiKey + '&sort=popularity';
// ? sort = alpha | date | popularity | style | trending
var fontList = [];
var fontList2 = '';
var i = 0;
var j;

function getData () {
  $.get(apiUrl, function (fonts) {
    // console.log(fonts);
    for (j = i; j < fonts.items.length; j++) {
      fontList[j] = {
        'family': fonts.items[j].family,
        'category': fonts.items[j].category,
        'lastModified': fonts.items[j].lastModified,
        'lastModifiedCapHeight': '',
        'cap-height': 0
      };
    }

    if (fontList2) {
      fontList2 = JSON.parse(fontList2);

      for (var k = 0; k < fontList2.length; k++) {
        fontList[k]['cap-height'] = fontList2[k]['cap-height'];
      }
    }

    console.log(JSON.stringify(fontList));
  }).fail(function () {
    alert('error');
  });
}


function getCapHeight () {
  var selectedFont;
  var capHeight;

  selectedFont = fontList[i].family;
console.log(1);
  WebFont.load({
    google: {
      families: [selectedFont + ':400'],
      text: 'XM'
    },
    active: function () {
      $('body').css('font-family', selectedFont);
      capHeight = capHeightPlease();
      fontList[i]['cap-height'] = capHeight.toFixed(3);

      console.log(i, JSON.stringify(fontList[i]));
      i++;
      if (fontList[i].family)
        getCapHeight();
    }
  });
}

$(function () {
  $(document).on('click', '#getCap', function () {
    getCapHeight();
  });
});
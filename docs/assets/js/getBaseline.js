/*!
 * getBaseline.js v0.1.0
 *
 * Released under the MIT Licence
 * https://github.com/designmeme/getBaseline.js/blob/master/LICENSE
 */
(function (window) {
  "use strict";

  window.getBaseline = function(font, sizeRange, elem) {
    var block, span, baselineHeight, baselineRatio, text, data, size, min, max, ratioList;

    elem = elem || document.body;
    font = font || window.getComputedStyle(elem, null).getPropertyValue('font-family');
    font = font.replace(/"/g, '');
    block = document.createElement('div');
    span = document.createElement('span');
    sizeRange = sizeRange || [11, 110]; // 11px ~ 110px
    text = 'Lqfglx';

    block.style.fontFamily = '"' + font + '"';
    block.style.lineHeight = '1';
    block.style.position = 'absolute';
    block.style.visibility = 'hidden';
    block.style.margin = '0';
    block.style.padding = '0';
    block.innerHTML = text;

    span.style.fontSize = '0';
    span.style.verticalAlign = 'baseline';
    span.style.padding = '0 10px';
    span.style.boxShadow = '0 1px 0 1px red';

    block.appendChild(span);
    elem.appendChild(block);

    data = [];
    ratioList = [];
    min = sizeRange[0];
    max = sizeRange[sizeRange.length - 1];

    if (min > max) {
      return;
    }

    for (var i = min; i <= max; i++) {
      size = i;
      block.style.fontSize = size + 'px';
      baselineHeight = size - span.offsetTop;
      baselineRatio = baselineHeight / size;
      data.push({
        'font-size': size + 'px',
        'baseline-offset': span.offsetTop + 'px',
        'baseline-height': baselineHeight + 'px',
        'baseline-ratio': baselineRatio
      });
      ratioList.push(baselineRatio);
    }

    block.parentNode.removeChild(block);

    function mean(array) {
      var sum = 0;
      for (var i = 0; i < array.length; i++) sum += array[i];
      return sum / array.length;
    }

    function meanAbsoluteDeviation(array) {
      var average = mean(array);
      return mean(array.map(function(num) {
        return Math.abs(num - average);
      }));
    }

    return {
      'font-family': font,
      'font-size-range': sizeRange,
      'baseline-ratio': mean(ratioList) + meanAbsoluteDeviation(ratioList),
      'data': data
    };
  };
}(this));
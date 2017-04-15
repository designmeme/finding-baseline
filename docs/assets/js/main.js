(function(window){

  // common variables
  var baseline = 8;
  var selectedFont;
  var testText = 'L';
  var isHome = document.body.classList.contains('home');
  var search = document.getElementById('search');
  var fontLink = document.querySelectorAll('#fontList li a');
  var baselineRatioInput = document.getElementById('baselineRatioInput');
  var btnBaselineRatio = document.querySelectorAll('.btn-baseline-ratio');
  var btnBaselineToggle = document.getElementById('btn-baseline-toggle');
  var btnBaselineColor = document.getElementById('btn-baseline-color');
  var btnBaseline = document.querySelectorAll('#baselineBtns .btn-baseline');
  var labLink = document.getElementById('labLink');
  var gitLink = document.getElementById('gitLink');
  var donateLink = document.getElementById('donateLink');
  var headerOpener = document.getElementById('headerOpener');
  var headerCloser = document.getElementById('headerCloser');
  var btnRaw = document.getElementById('btnRaw');

  /*
   * Search font family
   */
  function searchFont() {
    var input, filter, ul, li, a;

    input = document.getElementById('search');
    filter = input.value.toUpperCase();
    ul = document.getElementById('fontList');
    li = ul.getElementsByTagName('li');

    Array.prototype.forEach.call(li, function(el){
      a = el.getElementsByTagName('a')[0];
      if (a.getAttribute('data-family').toUpperCase().indexOf(filter) > -1) {
        el.style.display = '';
      } else {
        el.style.display = 'none';
      }
    });
  }
  search.addEventListener('keyup', searchFont);

  /*
   * Set Main Area - metrics
   */
  function setMainArea() {
    // var t0 = performance.now();
    var featuredFontSizes = [12, 13, 14, 15, 16, 17, 18, 19, 20, 22, 24, 26, 28, 30, 32, 36, 38, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 100, 110];
    var featured = document.getElementById('metricsFeatured');
    var all = document.getElementById('metricsGroup');
    var ready = document.body.getAttribute('data-metrics');

    if (ready !== null) {
      updateMetrics();
      // var t1 = performance.now();
      // console.log("Call to updateMetrics took " + (t1 - t0) + " milliseconds.");
      return;
    }

    featured.innerHTML = '';
    all.innerHTML = '';

    setMetrics(featured, featuredFontSizes, 'Featured');
    setMetricsGroup(all);

    document.body.setAttribute('data-metrics', 'true');

    function setMetricsGroup (metrics) {
      var min = 11;
      var max = 120;
      var step = 1;
      var number = 20;
      var sizes;

      while (min <= max) {
        sizes = [];
        for (var i = 0; i < number; i++) {
          if (min <= max) {
            sizes.push(min);
            min += step;
          }
        }
        setMetrics(metrics, sizes);
      }
    }
    // var t1 = performance.now();
    // console.log("Call to setMainArea took " + (t1 - t0) + " milliseconds.");
  }

  /*
   * Set Metrics
   */
  function setMetrics (metrics, sizes, titleText) {
    var min, max, outer, inner, type, title, lineHeight, i;

    min = sizes[0];
    max = sizes[sizes.length - 1];
    lineHeight = Math.ceil(max / baseline) * 1 * baseline;

    // create new metrics
    title = document.createElement('h5');
    title.classList.add('title');
    title.textContent = titleText || min + ' – ' + max + 'px';

    inner = document.createElement('div');
    inner.classList.add('inner');
    inner.style.paddingBottom = baseline + 'px';
    // inner.style.height = lineHeight + 'px';

    outer = document.createElement('div');
    outer.classList.add('outer');
    outer.classList.add('baseline');
    outer.setAttribute('data-min', min);
    outer.setAttribute('data-max', max);
    outer.setAttribute('data-lh', lineHeight);

    metrics.appendChild(title);
    outer.appendChild(inner);
    metrics.appendChild(outer);

    for (i = 0; i < sizes.length; i++) {
      type = document.createElement('p');
      type.classList.add('type');
      type.setAttribute('data-size', sizes[i]);
      type.textContent = testText;

      inner.appendChild(type);
      onBaseline(type);
    }

    setInnerWidth();
  }

  /*
   * Update Metrics
   */
  function updateMetrics () {
    var outer, inner, type, min, max, lineHeight;

    outer = document.querySelectorAll('.metrics .outer');

    Array.prototype.forEach.call(outer, function(el){
      min = el.getAttribute('data-min');
      max = el.getAttribute('data-max');
      lineHeight = Math.ceil(max / baseline) * 1 * baseline;
      el.setAttribute('data-lh', lineHeight);

      inner = el.querySelectorAll('.inner');
      Array.prototype.forEach.call(inner, function(el){
        el.style.paddingBottom = baseline + 'px';

        type = el.querySelectorAll('.type');
        Array.prototype.forEach.call(type, function(el){
          onBaseline(el);
        });
      });
    });

    setInnerWidth();
  }

  // for horizontal scroll
  function setInnerWidth (){
    var inner = document.querySelectorAll('.metrics .inner');
    Array.prototype.forEach.call(inner, function(el){
      var width = 0;
      var type = el.querySelectorAll('.type');

      Array.prototype.forEach.call(type, function(el){
        width += el.offsetWidth;
      });

      el.style.width = width + 10 + 'px';
    });
  }

  /*
   * Set Type on Baseline
   */
  function onBaseline (element) {
    var fontSize, lineHeight, baselineRatio, baselineDistance;

    fontSize = element.getAttribute('data-size');
    lineHeight = element.parentNode.parentNode.getAttribute('data-lh') / fontSize;  // line-height px to unitless
    baselineRatio = parseFloat(baselineRatioInput.textContent);
    baselineDistance = (lineHeight - 1)/2 + baselineRatio;

    element.style.fontFamily = '"' + selectedFont + '"';
    element.style.fontSize = fontSize + 'px';
    element.style.lineHeight = lineHeight;
    element.style.top = baselineDistance + 'em';
    element.setAttribute('title', fontSize + 'px');
  }


  /*
   * Set Font Family: Click Event of Font List
   */
  function setFontFamily (index) {
    var that, selectedFontBaselineRatio, defaultFontBaselineRatio, family;

    if (typeof index === 'number') {
      that = fontLink[index];
    } else {
      that = this;
    }
    selectedFont = that.getAttribute('data-family');
    selectedFontBaselineRatio = that.getAttribute('data-baseline-ratio');
    defaultFontBaselineRatio = '0.150';

    if (selectedFont === 'Open Sans Condensed'
      || selectedFont === 'Buda'
    ) {
      family = selectedFont + ':300';
    } else if (selectedFont === 'UnifrakturCook') {
      family = selectedFont + ':700';
    } else if (selectedFont === 'Coda Caption') {
      family = selectedFont + ':800';
    } else if (selectedFont === 'Molle') {
      family = selectedFont + ':400i';
    } else {
      // family = selectedFont + ':400';
      family = selectedFont;
    }

    WebFont.load({
      google: {
        families: [family]
      },
      inactive: function () {
        // console.log('inactive');
      },
      active: function () {
        var name, active, newValue;

        // console.log(selectedFont + ' is Loaded!');
        active = that.parentNode.parentNode.querySelector('.active');
        if (active !== null) {
          active.classList.remove('active');
        }
        that.parentNode.classList.add('active');

        name = document.getElementById('name');
        name.textContent = selectedFont;
        if (isHome) {
          newValue = selectedFontBaselineRatio || defaultFontBaselineRatio;
          baselineRatioInput.textContent = newValue.replace('0.', '.');

          var tt = getBaseline(selectedFont)['baseline-ratio'];
          console.log(tt.toFixed(3), newValue, tt - newValue);

          setMainArea();
          hideHeader();
          document.body.scrollTop = 0
        } else {
          // calculator page
          createCalculator();
        }
      }
    });
  }

  Array.prototype.forEach.call(fontLink, function(el){
    el.addEventListener('click', setFontFamily);
  });

  window.addEventListener('load', function () {
    // set default
    var number = Math.floor(Math.random() * 793);
    setFontFamily(number);
  });

  /*
   * Edit Baseline Ratio Input Value
   */
  function editBaselineRatio () {
    var input, value, unit, math, newValue;

    input = baselineRatioInput;
    value = parseFloat(input.textContent);
    unit = parseFloat(this.getAttribute('data-unit'));
    math = this.getAttribute('data-math');

    newValue =  math === 'plus' ? value + unit : value - unit;
    newValue = newValue.toFixed(3).replace('0.', '.');
    input.textContent = newValue;

    setMainArea();
  }

  if (btnBaselineRatio.length) {
    Array.prototype.forEach.call(btnBaselineRatio, function(el){
      el.addEventListener('click', editBaselineRatio);
    });
  }

  /*
   * Set Baseline Value
   */
  function setBaseline (event) {
    var button, metrics, className;

    className = 'active';

    // change baseline value
    if (event.type === 'click') {
      button = this;

      if (button.classList.contains(className)) {
        return false;
      }

      baseline = parseInt(button.textContent);
      button.parentNode.querySelector('.active').classList.remove(className);
      button.classList.add(className);
    }

    // set ruler background size to baseline
    metrics = document.querySelectorAll('.metrics');
    Array.prototype.forEach.call(metrics, function(el){
      el.style.backgroundSize = '100% ' + baseline + 'px';
    });

    setMainArea();
  }

  if (btnBaseline.length) {
    window.addEventListener('load', setBaseline);

    Array.prototype.forEach.call(btnBaseline, function(el){
      el.addEventListener('click', setBaseline);
    });
  }

  /*
   * Event: Toggle Baseline
   */
  function toggleBaseline () {
    var baseline = document.querySelectorAll('.baseline');

    Array.prototype.forEach.call(baseline, function(el){
      el.classList.toggle('baseline-none');
    });
  }

  if (btnBaselineToggle) {
    btnBaselineToggle.addEventListener('click', toggleBaseline);
  }

  /*
   * Change type color
   */
  function changeColor () {
    var el = document.getElementById('metricsArea');

    el.classList.toggle('white-type')
  }

  if (btnBaselineColor) {
    btnBaselineColor.addEventListener('click', changeColor);
  }

  /*
   * Toggle header
   */
  function showHeader (event) {
    event.preventDefault();
    document.body.classList.add('opened');
  }
  headerOpener.addEventListener('click', showHeader);
  function hideHeader (event) {
    if (event) {
      event.preventDefault();
    }
    document.body.classList.remove('opened');
  }
  headerCloser.addEventListener('click', hideHeader);

  /*
   * Baseline Calculator
   */
  function createCalculator () {
    var raw = getBaseline(selectedFont);
    var data = raw.data;
    var html = '';
    var currentSizeData, size, offset, height, ratio;
    var calcOffset = document.getElementById('calcOffset');
    var calcBaseline = document.getElementById('calcBaseline');
    var calcText = document.getElementById('calcText');
    var sizeRange = document.getElementById('sizeRange');
    var resultSize = document.getElementById('resultSize');
    var resultOffset = document.getElementById('resultOffset');
    var resultHeight = document.getElementById('resultHeight');
    var resultRatio = document.getElementById('resultRatio');
    var briefFamily = document.getElementById('briefFamily');
    var briefRatio = document.getElementById('briefRatio');
    var dataTable = document.getElementById('dataTable');
    var rawData = document.getElementById('rawData');

    briefFamily.innerText = raw['font-family'];
    briefRatio.innerText = raw['baseline-ratio'];
    rawData.innerText = JSON.stringify(raw, null, 2);

    for (var i = 0; i < data.length; i++) {
      html += '<tr>';
      html += '<td>' + data[i]['font-size'] + '</td>';
      html += '<td>' + data[i]['baseline-offset'] + '</td>';
      html += '<td>' + data[i]['baseline-height'] + '</td>';
      html += '<td class="align-left">' + data[i]['baseline-ratio'] + '</td>';
      html += '</tr>';
    }

    dataTable.innerHTML = html;

    function drawCalcText () {
      size = sizeRange.value;
      currentSizeData = data[size - raw['font-size-range'][0]];
      calcText.style.fontSize = size + 'px';
      calcText.style.fontFamily = '"' + selectedFont + '"';
      calcOffset.style.height = currentSizeData['baseline-offset'];
      calcBaseline.style.height = currentSizeData['baseline-height'];
      resultSize.innerText = size + 'px';
      resultOffset.innerText = currentSizeData['baseline-offset'];
      resultHeight.innerText = currentSizeData['baseline-height'];
      resultRatio.innerText = currentSizeData['baseline-ratio'].toFixed(3);
    }
    sizeRange.addEventListener('change', drawCalcText); // for ie10
    sizeRange.addEventListener('input', drawCalcText);
    drawCalcText();
  }

  /*
   * Toggle Raw Data Section
   */
  if (btnRaw) {
    btnRaw.addEventListener('click', function (e) {
      e.preventDefault();

      var div = document.getElementById('rawData');
      console.log(div.style.display);
      if (window.getComputedStyle(div)['display'] == 'none') {
        div.style.display = 'block';
      } else {
        div.style.display = 'none';
      }
    });
  }

  /*
   * Google analytics
   */
  if (typeof ga != 'undefined') {
    Array.prototype.forEach.call(fontLink, function(el){
      el.addEventListener('click', function() {
        ga('send', {
          hitType: 'event',
          eventCategory: 'Font Family',
          eventAction: 'click',
          eventLabel: this.getAttribute('data-family')
        });
      });
    });

    if (btnBaselineRatio) {
      Array.prototype.forEach.call(btnBaselineRatio, function(el){
        el.addEventListener('click', function() {
          ga('send', {
            hitType: 'event',
            eventCategory: 'Baseline Ratio',
            eventAction: 'click',
            eventLabel: (this.getAttribute('data-math') === 'plus' ? '+' : '-') + '' + this.getAttribute('data-unit')
          });
        });
      });
    }

    if (btnBaseline) {
      Array.prototype.forEach.call(btnBaseline, function(el){
        el.addEventListener('click', function() {
          ga('send', {
            hitType: 'event',
            eventCategory: 'Baseline',
            eventAction: 'click',
            eventLabel: parseInt(this.textContent) + 'px'
          });
        });
      });
    }

    if (btnBaselineToggle) {
      btnBaselineToggle.addEventListener('click', function() {
        ga('send', {
          hitType: 'event',
          eventCategory: 'Baseline',
          eventAction: 'click',
          eventLabel: 'toggle'
        });
      });
    }

    if (btnBaselineColor) {
      btnBaselineColor.addEventListener('click', function() {
        ga('send', {
          hitType: 'event',
          eventCategory: 'Baseline',
          eventAction: 'click',
          eventLabel: 'color'
        });
      });
    }

    labLink.addEventListener('click', function() {
      ga('send', {
        hitType: 'event',
        eventCategory: 'Link',
        eventAction: 'click',
        eventLabel: 'Lab'
      });
    });

    gitLink.addEventListener('click', function() {
      ga('send', {
        hitType: 'event',
        eventCategory: 'Link',
        eventAction: 'click',
        eventLabel: 'Git'
      });
    });

    donateLink.addEventListener('click', function() {
      ga('send', {
        hitType: 'event',
        eventCategory: 'Link',
        eventAction: 'click',
        eventLabel: 'Donate'
      });
    });
  }

})(window);
(function(window){

  // common variables
  var baseline = 8;
  var selectedFont;
  var testText = 'L';
  var search = document.getElementById('search');
  var fontLink = document.querySelectorAll('#fontList li a');
  var capHeightPx = document.getElementById('capHeightPx');
  var btnCapHeight = document.querySelectorAll('.btn-cap-height');
  var btnBaselineToggle = document.getElementById('btn-baseline-toggle');
  var btnBaselineColor = document.getElementById('btn-baseline-color');
  var btnBaseline = document.querySelectorAll('#baselineBtns .btn-baseline');
  var gitLink = document.getElementById('gitLink');
  var donateLink = document.getElementById('donateLink');

  /*
   * Search font family
   */
  function searchFont() {
    var input, filter, ul, li, a;

    input = document.getElementById('search');
    filter = input.value.toUpperCase();
    ul = document.getElementById('fontList');
    li = ul.getElementsByTagName('li');

    Array.prototype.forEach.call(li, function(el, i){
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
      // console.log("Call to setMainArea took " + (t1 - t0) + " milliseconds.");
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
    // console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.");
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
    outer.classList.add('outer', 'baseline');
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

    Array.prototype.forEach.call(outer, function(el, i){
      min = el.getAttribute('data-min');
      max = el.getAttribute('data-max');
      lineHeight = Math.ceil(max / baseline) * 1 * baseline;
      el.setAttribute('data-lh', lineHeight);

      inner = el.querySelectorAll('.inner');
      Array.prototype.forEach.call(inner, function(el, i){
        el.style.paddingBottom = baseline + 'px';

        type = el.querySelectorAll('.type');
        Array.prototype.forEach.call(type, function(el, i){
          onBaseline(el);
        });
      });
    });

    setInnerWidth();
  }

  // for horizontal scroll
  function setInnerWidth (){
    var inner = document.querySelectorAll('.metrics .inner');
    Array.prototype.forEach.call(inner, function(el, i){
      var width = 0;
      var type = el.querySelectorAll('.type');

      Array.prototype.forEach.call(type, function(el, i){
        width += el.offsetWidth;
      });

      el.style.width = width + 2 + 'px';
    });
  }

  /*
   * Set Type on Baseline
   */
  function onBaseline (element) {
    var fontSize, lineHeight, capHeight, baselineDistance;

    fontSize = element.getAttribute('data-size');
    lineHeight = element.parentNode.parentNode.getAttribute('data-lh') / fontSize;  // line-height px to unitless
    capHeight = parseFloat(capHeightPx.textContent);
    baselineDistance = (lineHeight - capHeight) / 2;

    element.style.fontFamily = selectedFont;
    element.style.fontSize = fontSize + 'px';
    element.style.lineHeight = lineHeight;
    element.style.top = baselineDistance + 'em';
    element.setAttribute('title', fontSize + 'px');
  }


  /*
   * Set Font Family: Click Event of Font List
   */
  function setFontFamily (index) {
    var that, selectedFontCapHeight, defaultFontCapHeight, weight;

    if (typeof index == 'number') {
      that = fontLink[index];
    } else {
      that = this;
    }
    selectedFont = that.getAttribute('data-family');
    selectedFontCapHeight = that.getAttribute('data-cap-height');
    defaultFontCapHeight = '0.700';

    if (selectedFont == 'Open Sans Condensed') {
      weight = '300';
    } else {
      weight = '400'
    }

    WebFont.load({
      google: {
        families: [selectedFont + ':' + weight],
        text: testText
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
        newValue = selectedFontCapHeight || defaultFontCapHeight;
        capHeightPx.textContent = newValue.replace('0.', '.');

        setMainArea();
      }
    });
  }

  Array.prototype.forEach.call(fontLink, function(el, i){
    el.addEventListener('click', setFontFamily);
  });

  window.addEventListener('load', function () {
    // set default
    setFontFamily(0);
  });

  /*
   * Edit Cap Height Input Value
   */
  function editCapHeight () {
    var input, value, unit, math, newValue;

    input = capHeightPx;
    value = parseFloat(input.textContent);
    unit = parseFloat(this.getAttribute('data-unit'));
    math = this.getAttribute('data-math');

    newValue =  math == 'plus' ? value + unit : value - unit;

    if (newValue < input.getAttribute('data-min') || newValue > input.getAttribute('data-max')) {
      return false;
    }

    newValue = newValue.toFixed(3).replace('0.', '.');
    input.textContent = newValue;

    setMainArea();
  }

  Array.prototype.forEach.call(btnCapHeight, function(el, i){
    el.addEventListener('click', editCapHeight);
  });

  /*
   * Set Baseline Value
   */
  function setBaseline (event) {
    var button, metrics, className;

    className = 'active';

    // change baseline value
    if (event.type == 'click') {
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
    Array.prototype.forEach.call(metrics, function(el, i){
      el.style.backgroundSize = '100% ' + baseline + 'px';
    });

    setMainArea();
  }
  window.addEventListener('load', setBaseline);

  Array.prototype.forEach.call(btnBaseline, function(el, i){
    el.addEventListener('click', setBaseline);
  });

  /*
   * Event: Toggle Baseline
   */
  function toggleBaseline () {
    var baseline = document.querySelectorAll('.baseline');

    Array.prototype.forEach.call(baseline, function(el, i){
      el.classList.toggle('baseline-none');
    });
  }

  btnBaselineToggle.addEventListener('click', toggleBaseline);

  /*
   * Change type color
   */
  function changeColor () {
    var el = document.getElementById('metricsArea');

    el.classList.toggle('white-type')
  }

  btnBaselineColor.addEventListener('click', changeColor);


  /*
   * Google analytics
   */
  if (typeof ga != 'undefined') {
    Array.prototype.forEach.call(fontLink, function(el, i){
      el.addEventListener('click', function() {
        ga('send', {
          hitType: 'event',
          eventCategory: 'Font Family',
          eventAction: 'click',
          eventLabel: this.getAttribute('data-family')
        });
      });
    });

    Array.prototype.forEach.call(btnCapHeight, function(el, i){
      el.addEventListener('click', function() {
        ga('send', {
          hitType: 'event',
          eventCategory: 'Cap Height',
          eventAction: 'click',
          eventLabel: (this.getAttribute('data-math') == 'plus' ? '+' : '-') + '' + this.getAttribute('data-unit')
        });
      });
    });

    Array.prototype.forEach.call(btnBaseline, function(el, i){
      el.addEventListener('click', function() {
        ga('send', {
          hitType: 'event',
          eventCategory: 'Baseline',
          eventAction: 'click',
          eventLabel: parseInt(this.textContent) + 'px'
        });
      });
    });

    btnBaselineToggle.addEventListener('click', function() {
      ga('send', {
        hitType: 'event',
        eventCategory: 'Baseline',
        eventAction: 'click',
        eventLabel: 'toggle'
      });
    });

    btnBaselineColor.addEventListener('click', function() {
      ga('send', {
        hitType: 'event',
        eventCategory: 'Baseline',
        eventAction: 'click',
        eventLabel: 'color'
      });
    });

    gitLink.addEventListener('click', function() {
      ga('send', {
        hitType: 'event',
        eventCategory: 'Git',
        eventAction: 'click',
        eventLabel: 'Veiw on GitHub'
      });
    });

    donateLink.addEventListener('click', function() {
      ga('send', {
        hitType: 'event',
        eventCategory: 'Donate',
        eventAction: 'click',
        eventLabel: 'default'
      });
    });
  }

})(window);
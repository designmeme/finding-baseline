(function (window) {
  window.capHeightPlease = function(elem) {
    var container, zero, test, baselineDistance, height;

    elem = elem || document.body;

    container = document.createElement('div');
    container.style.display = "block";
    container.style.position = "absolute";
    container.style.left = "0";
    container.style.top = "0";
    container.style.width = "0";
    container.style.height = "auto";
    container.style.margin = "0";
    container.style.padding = "0";
    container.style.lineHeight = "1";
    container.style.visibility = "hidden";
    container.style.overflow = "hidden";

    zero = document.createElement('span');
    test = document.createElement('span');

    zero.style.fontSize = "0px";
    test.style.fontSize = "42px";
    zero.innerHTML = "X";
    test.innerHTML = "X";

    container.appendChild(zero);
    container.appendChild(test);

    elem.appendChild(container);
    baselineDistance = $(zero).offset().top; // offset 은 윈도우 기반이라 parent 기반으로 변경 필요
    height = $(container).height();
    elem.removeChild(container);

    return (height - (height - baselineDistance) * 2) / height;
  };
}(window));
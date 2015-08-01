define(function (require) {
  var d3 = require("d3");
  var events = require("src/modules/component/events");

  return function path() {
    var pathGenerator = null;
    var color = d3.scale.category10();
    var accessor = function (d) { return d; };
    var values = null;

    // Options
    var cssClass = "path";
    var transform = "translate(0,0)";
    var fill = "none";
    var stroke = function (d, i) { return color(i); };
    var strokeWidth = 1;
    var opacity = null;
    var listeners = {};

    function element(selection) {
      selection.each(function (data, index) {
        var pathEvents = events().listeners(listeners);

        var path = d3.select(this).selectAll("path")
          .data(values ? values.map(accessor) : accessor);

        path.exit().remove();

        path.enter().append("path")
          .attr("transform", transform)
          .attr("class", cssClass)
          .attr("fill", fill)
          .attr("stroke", stroke)
          .attr("stroke-width", strokeWidth)
          .attr("d", pathGenerator)
          .style("opacity", opacity);

        path.call(pathEvents);
      });
    }

    // Public API
    element.data = function (_) {
      if (!arguments.length) { return values; }
      values = _;
      return element;
    };

    element.pathGenerator = function (_) {
      if (!arguments.length) { return pathGenerator; }
      pathGenerator = _;
      return element;
    };

    element.accessor = function (_) {
      if (!arguments.length) { return accessor; }
      accessor = _;
      return element;
    };

    element.color = function (_) {
      if (!arguments.length) { return color; }
      color = _;
      return element;
    };

    element.cssClass = function (_) {
      if (!arguments.length) { return cssClass; }
      cssClass = _;
      return element;
    };

    element.transform = function (_) {
      if (!arguments.length) { return transform; }
      transform = _;
      return element;
    };

    element.fill = function (_) {
      if (!arguments.length) { return fill; }
      fill = _;
      return element;
    };

    element.opacity = function (_) {
      if (!arguments.length) { return opacity; }
      opacity = _;
      return element;
    };

    element.stroke = function (_) {
      if (!arguments.length) { return stroke; }
      stroke = _;
      return element;
    };

    element.strokeWidth = function (_) {
      if (!arguments.length) { return strokeWidth; }
      strokeWidth = _;
      return element;
    };

    element.listeners = function (_) {
      if (!arguments.length) { return listeners; }
      listeners = _;
      return element;
    };

    return element;
  };
});

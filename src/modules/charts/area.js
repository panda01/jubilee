define(function (require) {
  var d3 = require("d3");

  return function areaChart() {
    var margin = {top: 20, right: 20, bottom: 20, left: 50};
    var width = 760 - margin.left - margin.right;
    var height = 120 - margin.top - margin.bottom;
    var color = d3.scale.category20c();
    var interpolate = "linear";
    var offset = "zero";
    var label = function (d) { return d.label; };
    var xValue = function (d) { return d.x; };
    var yValue = function (d) { return d.y; };
    var xAxis = d3.svg.axis().orient("bottom").ticks(5);
    var yAxis = d3.svg.axis().orient("left");
    var xScale = d3.time.scale.utc().range([0, width]);
    var yScale = d3.scale.linear().range([height, 0]).nice();
    var xDomain = function (data) {
      return d3.extent(data, function (d) { return d.x; });
    };
    var yDomain = function (data) {
      return [
        Math.min(0, getYStackExtent.call(data, "min")),
        Math.max(0, getYStackExtent.call(data, "max"))
      ];
    };
    var dispatch = d3.dispatch("brush", "hover", "mouseover", "mouseout");

    //axis options
    var showXAxis = true;
    var showYAxis = true;
    var xAxisTitle = "";
    var yAxisTitle = "";

    // Area options
    var areaClass = "area";
    var areaStroke = function (d, i) { return color(i); };
    var areaFill = function (d, i) { return color(i); };

    // Line options
    var addLines = true;
    var lineClass = "line";
    var lineStroke = function (d, i) { return color(i); };

    function chart(selection) {
      selection.each(function (data) {
        var stack = d3.layout.stack().x(X).y(Y);
        var area = d3.svg.area().x(X).y0(Y0).y1(Y);
        var line = d3.svg.line().x(X).y(Y);
        var layers;
        var svg;
        var g;

        data = data.map(function (d) {
          return d.map(function (e, i) {
            return {
              label: label.call(d, e, i),
              x: xValue.call(d, e, i),
              y: yValue.call(d, e, i)
            };
          });
        });

        stack.offset(offset);
        layers = stack(data);

        xScale.domain(xDomain.call(mapDomain(data)));
        yScale.domain(yDomain.call(mapDomain(data)));

        area.interpolate(interpolate);
        line.interpolate(interpolate);

        svg = d3.select(this).selectAll("svg")
          .data([layers])
          .enter().append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom);

        g = svg.append("g")
          .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

        g.selectAll("g")
          .data(function (d) { return d; })
          .enter().append("g")
          .append("path")
          .attr("class", areaClass)
          .attr("stroke", areaStroke)
          .attr("fill", areaFill)
          .attr("d", area);

        if (addLines) {
          g.selectAll("g")
            .data(function (d) { return d; })
            .enter().append("g")
            .append("path")
            .attr("class", lineClass)
            .attr("stroke", lineStroke)
            .attr("d", line);
        }

        g.append("g").attr("class", "x axis");
        g.append("g").attr("class", "y axis");

        if (showXAxis) {
          g.select(".x.axis")
            .attr("transform", "translate(0," + yScale.range()[0] + ")")
            .call(xAxis.scale(xScale))
            .append("text")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(xAxisTitle);
        }

        if (showYAxis) {
          g.select(".y.axis")
            .call(yAxis.scale(yScale))
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text(yAxisTitle);
        }
      });
    }

    function X(d) {
      return xScale(d.x);
    }

    function Y0(d) {
      if (offset ==="overlap") { return yScale(0); }
      return yScale(d.y0);
    }

    function Y(d) {
      if (offset === "overlap") { return yScale(d.y); }
      return yScale(d.y0 + d.y);
    }

    function mapDomain (data) {
      return data.reduce(function (a, b) {
        return a.concat(b);
      });
    }

    function getYStackExtent(data, extent) {
      return d3[extent](data, Y);
    }

    chart.margin = function (_) {
      if (!arguments.length) { return margin; }
      margin.top = typeof _.top !== "undefined" ? _.top : margin.top;
      margin.right = typeof _.right !== "undefined" ? _.right : margin.right;
      margin.bottom = typeof _.bottom !== "undefined" ? _.bottom : margin.bottom;
      margin.left = typeof _.left !== "undefined" ? _.left : margin.left;
      return chart;
    };

    chart.width = function (_) {
      if (!arguments.length) { return width; }
      width = _;
      return chart;
    };

    chart.height = function (_) {
      if (!arguments.length) { return height; }
      height = _;
      return chart;
    };

    chart.color = function (_) {
      if (!arguments.length) { return color; }
      color = _;
      return chart;
    };

    chart.x = function (_) {
      if (!arguments.length) { return xValue; }
      xValue = _;
      return chart;
    };

    chart.y = function (_) {
      if (!arguments.length) { return yValue; }
      yValue = _;
      return chart;
    };

    chart.xAxis = function (_) {
      if (!arguments.length) { return xAxis; }
      xAxis = _;
      return chart;
    };

    chart.yAxis = function (_) {
      if (!arguments.length) { return yAxis; }
      yAxis = _;
      return chart;
    };

    chart.xScale = function (_) {
      if (!arguments.length) { return xScale; }
      xScale = _;
      return chart;
    };

    chart.yScale = function (_) {
      if (!arguments.length) { return yScale; }
      yScale = _;
      return chart;
    };

    chart.xDomain = function (_) {
      if (!arguments.length) { return xDomain; }
      xDomain = _;
      return chart;
    };

    chart.yDomain = function (_) {
      if (!arguments.length) { return yDomain; }
      yDomain = _;
      return chart;
    };

    chart.dispatch = function (_) {
      if (!arguments.length) { return dispatch; }
      dispatch = _;
      return chart;
    };

    chart.showXAxis = function (_) {
      if (!arguments.length) { return showXAxis; }
      showXAxis = _;
      return chart;
    };

    chart.showYAxis = function (_) {
      if (!arguments.length) { return showYAxis; }
      showYAxis = _;
      return chart;
    };

    chart.xAxisTitle = function (_) {
      if (!arguments.length) { return xAxisTitle; }
      xAxisTitle = _;
      return chart;
    };

    chart.yAxisTitle = function (_) {
      if (!arguments.length) { return yAxisTitle; }
      yAxisTitle = _;
      return chart;
    };

    chart.interpolate = function (_) {
      if (!arguments.length) { return interpolate; }
      interpolate = _;
      return chart;
    };

    chart.offset = function (_) {
      if (!arguments.length) { return offset; }
      offset = _;
      return chart;
    };

    chart.addLines = function (_) {
      if (!arguments.length) { return addLines; }
      addLines = _;
      return chart;
    };

    chart.lineStroke = function (_) {
      if (!arguments.length) { return lineStroke; }
      lineStroke = _;
      return chart;
    };

    chart.lineClass = function (_) {
      if (!arguments.length) { return lineClass; }
      lineClass = _;
      return chart;
    };

    d3.rebind(chart, dispatch, "on");
    return chart;
  };
});
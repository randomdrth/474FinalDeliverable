var margin = { top: 40, right: 30, bottom: 70, left: 60 },
  width = 500 - margin.left - margin.right,
  height = 350 - margin.top - margin.bottom;

d3.csv("data.csv", function (data) {
  // Utilized ChatGPT to help me draw a plot per city  
  var nested = d3.nest().key(function (d) {
      return d.city;
    })
    .entries(data);

  keys = nested.map(function (d) {
    return d.key;
  });

  var svg = d3
    .select("#graph")
    .selectAll("uniqueChart")
    .data(nested)
    .enter()
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // The X axis
  var x = d3.scaleLinear().domain([1, 12.5]).range([0, width]);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(10));

  // The Y axis
  var y = d3.scaleLinear().domain([-15, 15]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y).ticks(6).tickSizeInner(-width));

  // Colors for each graph
  var color = d3
    .scaleOrdinal()
    .domain(keys)
    .range([
      "#2e8b57",
      "#4169e1",
      "#ff6347",
      "#9932cc",
      "#ffa500",
      "#8b4513",
      "#20b2aa",
      "#ff69b4",
      "#4682b4",
      "#800000",
    ]);

  svg 
    .append("path")
    .attr("fill", "none")
    .attr("class", "lines")
    .attr("stroke", function (d) {
      return color(d.key);
    })
    .attr("stroke-width", 2)
    .attr("d", function (d) {
      return d3
        .line()
        .x(function (d) {
          return x(d.month_num);
        })
        .y(function (d) {
          return y(+d.variation);
        })(d.values);
    });

  svg // Graph title with city name and unique color
    .append("text")
    .attr("class", "graph-title")
    .attr("text-anchor", "middle")
    .attr("y", -10)
    .attr("x", width / 2)
    .text(function (d) {
      return d.key;
    })
    .style("fill", function (d) {
      return color(d.key);
    });

  svg // X-axis label
    .append("text")
    .attr("class", "x-label")
    .text("Months of the Year")
    .attr("x", width / 2)
    .attr("y", height + margin.top - 10)
    .attr("text-anchor", "middle");

  svg // Y-axis label
    .append("text")
    .attr("class", "y-label")
    .text("Deviation in Degrees")
    .attr("y", -margin.left + 10)
    .attr("x", -height / 2)
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)");

  // Create a tooltip div that is hidden by default:
var tooltip = d3.select("#graph")
.append("div")
.style("opacity", 0)
.attr("class", "tooltip")
.style("background-color", "white")
.style("border", "solid")
.style("border-width", "2px")
.style("border-radius", "5px")
.style("padding", "5px")

// Three function that change the tooltip when user hover / move / leave a cell
var mouseover = function(d) {
tooltip
.style("opacity", 1)
}
var mousemove = function(d) {
// This will give the month number corresponding to the mouse position
var x0 = x.invert(d3.mouse(this)[0]);
// This will find the closest data point
var i = d3.bisect(d.values.map(function(d){return d.month_num;}), x0, 1);
var selectedData = d.values[i-1];
tooltip
.html("City: " + d.key + "<br>" + "Month: " + selectedData.month_num + "<br>" + "Deviation: " + selectedData.variation)
.style("left", (d3.mouse(this)[0]+70) + "px")
.style("top", (d3.mouse(this)[1]) + "px")
}
var mouseleave = function(d) {
tooltip
.style("opacity", 0)
}

// drawing each plot
var path = svg.append("path")
.attr("fill", "none")
.attr("class", "lines")
.attr("stroke", function (d) {
  return color(d.key);
})
.attr("stroke-width", 2)
.attr("d", function (d) {
  return d3
    .line()
    .x(function (d) {
      return x(d.month_num);
    })
    .y(function (d) {
      return y(+d.variation);
    })(d.values);
});

// Add an invisible thicker line for better hover interaction
var hoverPath = svg.append("path")
.attr("fill", "none")
.attr("class", "hover-line")
.attr("stroke", "transparent")
.attr("stroke-width", 10)
.attr("d", function (d) {
  return d3
    .line()
    .x(function (d) {
      return x(d.month_num);
    })
    .y(function (d) {
      return y(+d.variation);
    })(d.values);
});

// Add interactivity to the hover line
hoverPath.on("mouseover", mouseover)
.on("mousemove", mousemove)
.on("mouseleave", mouseleave)

});

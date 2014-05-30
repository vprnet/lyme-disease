GND.chart = {};

GND.chart.margin = {
    'top': 20,
    'right': 30,
    'bottom': 30,
    'left': 40
};

GND.chart.options = {
    'width': 450 - GND.chart.margin.left - GND.chart.margin.right,
    'height': 450 - GND.chart.margin.top - GND.chart.margin.bottom
};

GND.chart.x = d3.scale.ordinal()
    .rangeRoundBands([0, GND.chart.options.width], 0.1);

GND.chart.xAxis = d3.svg.axis()
    .scale(GND.chart.x)
    .orient("bottom");

GND.chart.y = d3.scale.linear()
    .range([GND.chart.options.height, 0]);

GND.chart.yAxis = d3.svg.axis()
    .scale(GND.chart.y)
    .orient("left");

GND.chart.avgValues = [
    {'name': 'VT',
    'mean': 164},
    {'name': 'RI',
    'mean': 342},
    {'name': 'ME',
    'mean': 412},
    {'name': 'NH',
    'mean': 544},
    {'name': 'CT',
    'mean': 2052},
    {'name': 'MA',
    'mean': 2163},
    {'name': 'All',
    'mean': 6271}
];

GND.chart.avgScale = d3.svg.axis()
    .scale(GND.chart.y)
    .tickValues([164, 342, 412, 544, 2052, 2163, 6271])
    .tickFormat(function(d, i) { return GND.chart.avgValues[i].name; })
    .orient("right");


GND.chart.x.domain(["'99", "'00", "'01", "'02", "'03", "'04", "'05", "'06",
    "'07", "'08", "'09", "'10", "'11", "'12"]);

GND.chart.base = d3.select(".chart")
    .attr("width", GND.chart.options.width + GND.chart.margin.left +
        GND.chart.margin.right)
    .attr("height", GND.chart.options.height + GND.chart.margin.top +
        GND.chart.margin.bottom)
    .append("g")
        .attr("transform", "translate(" + GND.chart.margin.left +
            "," + GND.chart.margin.top + ")");

GND.chart.init = function(state) {
    if (typeof state === 'undefined') {
        state = 'New England';
    }

    var data = GND.data[state].cases;
    GND.chart.data = data;

    GND.chart.y.domain([0, d3.max(data, function(d) { return d; })]);
    var max = d3.max(data, function(d) { return d; });

    GND.chart.base.append("text")
        .attr("class", "no-data")
        .attr("transform", "translate(30," + (GND.chart.options.height - 20) + ")")
        .text("No Data");

    GND.chart.base.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + GND.chart.options.height + ")")
        .call(GND.chart.xAxis);

    GND.chart.base.append("g")
        .attr("class", "y axis")
        .call(GND.chart.yAxis);

    GND.chart.base.append("g")
        .attr("class", "avg axis")
        .attr("transform", "translate(" + GND.chart.options.width + ",0)")
        .call(GND.chart.avgScale);

    GND.chart.base.selectAll(".bar")
            .data(data)
        .enter().append('rect')
            .attr("class", "bar")
            .attr("x", function(d,i) {
                return GND.chart.x(GND.chart.x.domain()[i]);
            })
            .attr("y", function(d) { return GND.chart.y(d); })
            .attr("height", function(d) {
                return GND.chart.options.height - GND.chart.y(d);
            })
            .attr("width", GND.chart.x.rangeBand());
};

GND.chart.update = function(state) {
    var data = GND.data[state].cases;

    // Update Y scale and axis
    GND.chart.y.domain([0, d3.max(data, function(d) { return parseInt(d, 10); })]);
    var max = d3.max(data, function(d) { return d; });

    var noData = GND.chart.base.select('text.no-data');

    if (!data[0]) {
        noData.style("visibility", "visible");
    } else {
        noData.style("visibility", "hidden");
    }

    GND.chart.base.select('.y.axis')
        .transition()
        .duration(1000)
        .call(GND.chart.yAxis);

    GND.chart.base.select('.avg.axis')
        .transition()
        .duration(1000)
        .call(GND.chart.avgScale);

    var bars = GND.chart.base.selectAll('.bar')
        .data(data);

    bars
        .transition()
        .duration(800)
        .attr("y", function(d) { return GND.chart.y(d); })
        .attr("height", function(d) {
            return GND.chart.options.height - GND.chart.y(d);
        });
};


GND.chart.selectorMap = {
    'All': 'New England',
    'VT': 'Vermont',
    'NH': 'New Hampshire',
    'ME': 'Maine',
    'MA': 'Massachusetts',
    'CT': 'Connecticut',
    'RI': 'Rhode Island'
};

$('ul.chart_selector li').on('click', function() {
    var state = GND.chart.selectorMap[$(this).text()];
    GND.chart.update(state);
});

function type(d) {
  d.value = +d.value; // coerce to number
  return d;
}

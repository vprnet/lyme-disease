GND.chart.margin = {
    'top': 20,
    'right': 10,
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

GND.chart.domain = ["'99", "'00", "'01", "'02", "'03", "'04", "'05", "'06",
    "'07", "'08", "'09", "'10", "'11", "'12"];

GND.chart.base = d3.select(".chart")
    .attr("width", GND.chart.options.width + GND.chart.margin.left +
        GND.chart.margin.right)
    .attr("height", GND.chart.options.height + GND.chart.margin.top +
        GND.chart.margin.bottom)
    .append("g")
        .attr("transform", "translate(" + GND.chart.margin.left +
            "," + GND.chart.margin.top + ")");

GND.chart.init = function(state, data) {
    data['New England'].cases = data['New England'].cases.slice(4);
    data.Connecticut.cases = data.Connecticut.cases.slice(4);

    if (typeof state === 'undefined') {
        state = 'New England';
    }

    GND.chart.x.domain(GND.chart.domain.slice(4));

    data = data[state].cases;


    GND.chart.y.domain([0, d3.max(data, function(d) { return d; })]);

    GND.chart.base.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + GND.chart.options.height + ")")
        .call(GND.chart.xAxis);

    GND.chart.base.append("g")
        .attr("class", "y axis")
        .call(GND.chart.yAxis);

    GND.chart.base.selectAll(".bar")
            .data(data, function(d,i) { return GND.chart.x.domain()[i]; })
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


    if (state === 'New England' || state === 'Connecticut') {
        GND.chart.x.domain(GND.chart.domain.slice(4));
    } else {
        GND.chart.x.domain(GND.chart.domain);
    }

    var data = GND.chart.data[state].cases;
    GND.chart.y.domain([0, d3.max(data, function(d) { return parseInt(d, 10); })]);
    var newData = [];
    for (i = 0; i < data.length; i++) {
        newData.push({'year': GND.chart.x.domain()[i],
            'cases': data[i]});
    }

    GND.chart.base.select('.y.axis')
        .transition()
        .duration(1000)
        .call(GND.chart.yAxis);

    GND.chart.base.select('.x.axis')
        .transition()
        .duration(1000)
        .call(GND.chart.xAxis);

    var bars = GND.chart.base.selectAll('.bar')
        .data(newData, function(d) { return d.year; });

    bars
        .transition()
        .duration(800)
        .attr("y", function(d) { return GND.chart.y(d.cases); })
        .attr("x", function(d) {
            return GND.chart.x(d.year);
        })
        .attr("height", function(d) {
            return GND.chart.options.height - GND.chart.y(d.cases);
        })
        .attr("width", GND.chart.x.rangeBand());

    bars.enter().append('rect')
        .attr('class', 'bar')
        .attr("y", GND.chart.options.height)
        .attr("height", 0)
        .transition()
            .delay(500)
            .duration(500)
            .attr("y", function(d) { return GND.chart.y(d.cases); })
            .attr("x", function(d,i) {
                return GND.chart.x(d.year);
            })
            .attr("height", function(d) {
                return GND.chart.options.height - GND.chart.y(d.cases);
            })
            .attr("width", GND.chart.x.rangeBand());

    bars.exit()
        .transition()
            .duration(500)
            .attr("y", GND.chart.options.height)
            .attr("height", 0)
            .remove();
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

GND.chart.margin = {
    'top': 20,
    'right': 10,
    'bottom': 30,
    'left': 60
};

GND.chart.divWidth = $('div.chart_div').width();
GND.chart.width = GND.chart.divWidth - 30;
GND.chart.height = (GND.chart.divWidth < 500) ? GND.chart.divWidth : 500;



GND.chart.options = {
    'width': GND.chart.width - GND.chart.margin.left - GND.chart.margin.right,
    'height': GND.chart.height - GND.chart.margin.top - GND.chart.margin.bottom
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
        .attr("class", "chart_box")
        .attr("transform", "translate(" + GND.chart.margin.left +
            "," + GND.chart.margin.top + ")");

GND.chart.init = function(state, data) {
    data['New England'].cases = data['New England'].cases.slice(4);
    data.Connecticut.cases = data.Connecticut.cases.slice(4);

    if (typeof state === 'undefined') {
        state = 'Northern New England';
    }

    GND.chart.x.domain(GND.chart.domain);

    data = data[state].cases;
    var newData = [];
    for (i = 0; i < data.length; i++) {
        newData.push({'year': GND.chart.x.domain()[i],
            'cases': data[i]});
    }

    GND.chart.y.domain([0, d3.max(newData, function(d) { return parseInt(d.cases, 10); })]);

    GND.chart.base.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + GND.chart.options.height + ")")
        .call(GND.chart.xAxis);

    GND.chart.base.append("g")
        .attr("class", "y axis")
        .call(GND.chart.yAxis);

    GND.chart.base.selectAll(".bar")
            .data(newData, function(d,i) { return d.year; })
        .enter().append('rect')
            .attr("class", "bar")
            .attr("x", function(d,i) {
                return GND.chart.x(d.year);
            })
            .attr("y", function(d) { return GND.chart.y(d.cases); })
            .attr("height", function(d) {
                return GND.chart.options.height - GND.chart.y(d.cases);
            })
            .attr("width", GND.chart.x.rangeBand());

    GND.chart.base.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -(GND.chart.height / 2) - 20)
        .attr("y", -50)
        .text("Probable Cases");

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
        .data(newData, function(d, i) { return d.year; });

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
    'NNE': 'Northern New England',
    'All': 'New England',
    'VT': 'Vermont',
    'NH': 'New Hampshire',
    'ME': 'Maine',
    'MA': 'Massachusetts',
    'CT': 'Connecticut',
    'RI': 'Rhode Island'
};

$('div.chart_selector button').on('click', function() {
    $('div.chart_selector button.active').removeClass('active');
    $(this).addClass('active');
    var state = GND.chart.selectorMap[$(this).text()];
    GND.chart.update(state);
    $('h4.chart_label').text(GND.chart.selectorMap[$(this).text()]);
});

function type(d) {
  d.value = +d.value; // coerce to number
  return d;
}

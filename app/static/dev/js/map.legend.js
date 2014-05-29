GND.legend.labels = {
    'cases': ['> 0', '> 1000', '> 2000', '> 3000'],
    'incidentRate': ['> 0', '> 10', '> 20', '> 30', '> 40', '> 50',
        '> 60', '> 70'],
    'growthRate': ['> -20', '> -15', '> -10', '> -5', '> 0', '> 5', '> 10',
        '> 15', '> 20', '> 25']
};

GND.legend.domain = {
    'cases': [0, 1000, 2000, 3000],
    'incidentRate': [0, 10, 20, 30, 40, 50, 60, 70],
    'growthRate': [-20, -15, -10, -5, 0, 5, 10, 15, 20, 25]
};

GND.legend.update = function(field) {
    var legend = GND.map.svg.selectAll('g.legend').remove();
    GND.legend.init(GND.map.field);

};

GND.legend.init = function(field) {
    var legend = GND.map.svg.selectAll("g.legend")
        .data(GND.legend.domain[field])
        .enter().append('g')
        .attr("class", "legend");

    var ls_w = 20,
        ls_h = 15;

    legend.append("rect")
        .attr("x", GND.map.options.width * 0.1)
        .attr("y", function(d,i) { 
            return GND.map.options.height * 0.3 - (i*ls_h) - 2*ls_h;})
        .attr("width", ls_w)
        .attr("height", ls_h)
        .style("fill", function(d,i) {
            return GND.map.getScale(GND.map.domain[field])(d); })
        .style("opacity", 0,8);

    legend.append("text")
        .attr("x", GND.map.options.width * 0.1 + 30)
        .attr("y", function(d,i) {
            return GND.map.options.height * 0.3 - (i*ls_h) - ls_h -5;})
        .text(function(d,i) { return GND.legend.labels[field][i]; });
};

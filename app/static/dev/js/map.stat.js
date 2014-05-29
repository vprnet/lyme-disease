GND.stat.update = function(field, state) {
    if (typeof state === 'undefined') {
        state = 'New England';
    }
    function numberWithCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    GND.stat.box.select('text.location-name')
        .text(state);

    GND.stat.box.select('text.field-value')
        .text(GND.stat.classToLabel[field]);

    var stat = GND.data[state][field];

    if (typeof stat === 'object') {
        GND.stat.box.select('text.stat-value')
            .text(numberWithCommas(stat[stat.length-1]));
    } else {
        GND.stat.box.select('text.stat-value')
            .text(GND.data[state][field]);
    }
};

GND.stat.init = function(field) {
    console.log('stat.init');
    GND.map.svg.append("g")
        .attr("class", "stat-box");

    GND.stat.box = GND.map.svg.select('g.stat-box');

    GND.stat.box.append("text")
        .attr("x", GND.map.options.width * 0.77)
        .attr("y", GND.map.options.height * 0.65)
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", "24px")
        .attr("fill", "white")
        .attr("class", "location-name")
        .text('New England');

    GND.stat.box.append("text")
        .attr("x", GND.map.options.width * 0.77)
        .attr("y", GND.map.options.height * 0.695)
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", "24px")
        .attr("fill", "white")
        .attr("class", "field-value")
        .text(GND.stat.classToLabel[field]);

    GND.stat.box.append("text")
        .attr("x", GND.map.options.width * 0.77)
        .attr("y", GND.map.options.height * 0.78)
        .attr("text-anchor", "middle")
        .attr("font-family", "sans-serif")
        .attr("font-size", "48px")
        .attr("font-weight", "bold")
        .attr("fill", "white")
        .attr("class", "stat-value")
        .text(GND.data['New England'][field]);
};

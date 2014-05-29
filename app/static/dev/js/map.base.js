GND.map.loadData = function(data, field) {
    GND.dataArray = Object.keys(GND.data);
    if (typeof field === 'undefined') {
        GND.map.field = 'growthRate';
    } else {
        GND.map.field = field;
    }

    if (typeof GND.map.base.objects.northeast.geometries[0].properties[GND.map.field] === 'undefined') {
        for (var i=0; i < GND.dataArray.length; i++) {
            var dataState = GND.dataArray[i];
            for (var j=0; j < GND.map.base.objects.northeast.geometries.length; j++) {
                var jsonState = GND.map.base.objects.northeast.geometries[j].properties.name;
                if (dataState == jsonState) {
                    GND.map.base.objects.northeast.geometries[j].properties[GND.map.field] = data[GND.dataArray[i]][GND.map.field];
                }
            }
        }
    }
    GND.map.render(GND.map.field);
};

GND.map.loadBaseMap = function(base) {

    GND.map.svg.append("path")
        .datum(topojson.feature(base, base.objects.canada))
        .attr("d", GND.map.path)
        .style("stroke", "#b2b3b5")
        .style("fill", "#838383")
        .style("stroke-width", "2");

    GND.map.svg.selectAll(".state")
        .data(topojson.feature(base, base.objects.northeast).features)
        .enter().append("path")
            .style("stroke", "#75787b")
            .style("stroke-width", 1)
            .style("fill", "#838383")
            .attr("class", "state")
            .attr("d", GND.map.path);
};

GND.map.loadAllData = function(error, base, data) {
    GND.map.base = base;
    GND.data = data;
    GND.map.loadBaseMap(base);
    GND.map.loadData(data);
    GND.legend.init(GND.map.field);
    GND.stat.init(GND.map.field);
};

GND.map.getScale = function(domain) {
    return d3.scale.threshold()
        .domain(domain)
        .range(GND.map.options.colorRange[GND.map.field]);
};


GND.map.render = function(field) {
    var states = GND.map.base;
    GND.map.currentScale = GND.map.getScale(GND.map.domain[field]);

    GND.map.svg.selectAll(".state")
        .data(topojson.feature(states, states.objects.northeast).features)
        .style("fill", GND.map.fillFunc)
        .on('mouseover', function(d) {
            console.log(d.properties.name);
            GND.stat.update(field, d.properties.name);
        });

    GND.map.svg.on('mouseout', function(d) {
        GND.stat.update(field);
    });
};

GND.map.fillFunc = function(d) {
    value = d.properties[GND.map.field];

    if (GND.map.field === 'cases' && value) {
        var casesIdx = value.length - 1;
        value = value[casesIdx];
    }

    if (value) {
        return GND.map.currentScale(value);
    }

    return "#838383";
};

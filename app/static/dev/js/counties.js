GND.counties.width = 133;
GND.counties.height = 175;

GND.counties.projection = d3.geo.transverseMercator()
    .rotate([72.57, -44.20])
    .translate([50,60])
    .scale([4000]);

GND.counties.path = d3.geo.path()
    .projection(GND.counties.projection);


GND.counties.mapColor = colorbrewer.Blues[9];

GND.counties.quantize = d3.scale.quantize()
    .domain([0, 150])
    .range(GND.counties.mapColor);

GND.counties.years = ['2000', '2001', '2002', '2003', '2004', '2005', '2006',
    '2007', '2008', '2009', '2010', '2011', '2012', '2013'];

GND.counties.init = function(vt, data) {
    var vermont = topojson.feature(vt, vt.objects.counties);

    for (var j=0; j<GND.counties.years.length; j++) {
        var svg = d3.select("#vt-counties").append("svg")
            .attr("x", 350*j)
            .attr("width", GND.counties.width)
            .attr("height", GND.counties.height);

        svg.append("path")
            .datum(vermont)
            .attr("d", GND.counties.path)
            .attr("x", j*400)
            .style("stroke", "#777")
            .style("stroke-width", "1");

        svg.selectAll(".subunit")
            .data(topojson.feature(vt, vt.objects.counties).features)
        .enter().append("path")
            .attr("d", GND.counties.path)
            .attr("class", "county")
            .style("fill", function(d) {
                for (var i=0; i<data.length; i++) {
                    if (data[i].county.toUpperCase() === d.properties.county) {
                        var cases = data[i][GND.counties.years[j]];
                        if (cases > 0) {
                            return GND.counties.quantize(cases);
                        } else {
                            return "#ccc";
                        }
                    }
                }
                return "#aaa";
            });
        }
};

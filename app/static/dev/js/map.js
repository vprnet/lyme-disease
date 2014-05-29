GND.init = function() {
    queue()
        .defer(d3.json, 'static/data/northeast.json')
        .defer(d3.json, 'static/data/lyme-data.json')
        .await(GND.map.loadAllData);
};

GND.map.options = {
    'width': 450,
    'height': 600,
    'colorRange': {
        'growthRate': colorbrewer.PuOr[11].slice(1),
        'cases': colorbrewer.Purples[4],
        'incidentRate': colorbrewer.Purples[9]
    }
};

GND.map.projection = d3.geo.transverseMercator()
    .rotate([72.57, -44.20])
    .translate([100,300])
    .scale(5000);

GND.map.path = d3.geo.path()
    .projection(GND.map.projection);


GND.map.svg = d3.select("#map").append("svg")
    .attr("width", GND.map.options.width)
    .attr("height", GND.map.options.height);


GND.map.domain = {
    'cases': [1000, 2000, 3000],
    'incidentRate': [10, 20, 30, 40, 50, 60, 70],
    'growthRate': [-15, -10, -5, 0, 5, 10, 15, 20, 25]
};

GND.stat.classToLabel = {
    'incidentRate': 'Incident Rate',
    'growthRate': 'Growth Rate',
    'cases': 'Cases (2012)'
};



$('#map_selector li').on('click', function() {
    GND.map.field = $(this).attr('id');
    GND.map.loadData(GND.data, GND.map.field);
    GND.legend.update(GND.map.field);
});

GND.init();

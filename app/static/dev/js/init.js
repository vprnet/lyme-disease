var GND = GND || {};
GND.chart = {};
GND.counties = {};

GND.loadAllData = function(error, chartData, vt, mapData) {
    GND.chart.data = chartData;
    GND.chart.init('New England', chartData);
    GND.counties.vt = vt;
    GND.counties.data = mapData;
    GND.counties.init(vt, mapData);
};

GND.init = function() {
    queue()
        .defer(d3.json, 'static/data/lyme-data.json')
        .defer(d3.json, "static/data/vermont-counties.json")
        .defer(d3.csv, "static/data/lyme-vt-counties.csv")
        .await(GND.loadAllData);
};

GND.init();

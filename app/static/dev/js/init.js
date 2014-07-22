var GND = GND || {};
GND.chart = {};
GND.counties = {};

GND.init = function() {
    d3.json('static/data/lyme-data.json', function(error, data) {
        GND.chart.data = data;
        GND.chart.init('Northern New England', data);
    });
};

GND.init();

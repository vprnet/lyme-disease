GND.init = function() {
    queue()
        .defer(d3.json, 'static/data/northeast.json')
        .defer(d3.json, 'static/data/lyme-data.json')
        .await(GND.map.loadAllData);
};

$('#map_selector li').on('click', function() {
    GND.map.field = $(this).attr('id');
    GND.map.loadData(GND.data, GND.map.field);
    GND.legend.update(GND.map.field);
    GND.stat.update(GND.map.field);
});

GND.init();

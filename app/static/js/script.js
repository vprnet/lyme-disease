var GND = GND || {};

GND.map = {};
GND.legend = {};
GND.stat = {};

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


GND.map.svg = d3.select("svg.map")
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

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

GND.stat.update = function(field, state) {
    if (typeof state === 'undefined') {
        state = 'New England';
    }

    var statDelay = 100;

    GND.stat.box.select('text.location-name')
        .transition()
        .text(state)
        .delay(statDelay);

    GND.stat.box.select('text.field-value')
        .transition()
        .text(GND.stat.classToLabel[field])
        .delay(statDelay);

    var stat = GND.data[state][field];

    if (typeof stat === 'object') {
        GND.stat.box.select('text.stat-value')
            .transition()
            .text(numberWithCommas(stat[stat.length-1]))
            .delay(statDelay);
    } else {
        GND.stat.box.select('text.stat-value')
            .transition()
            .text(GND.data[state][field])
            .delay(statDelay);
    }
};

GND.stat.init = function(field) {
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
    var legend = GND.map.svg.selectAll('g.legend')
        .remove();
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
    GND.chart.init();
};

GND.map.getScale = function(domain) {
    return d3.scale.threshold()
        .domain(domain)
        .range(GND.map.options.colorRange[GND.map.field]);
};


GND.map.render = function(field) {
    var states = GND.map.base;
    GND.map.currentScale = GND.map.getScale(GND.map.domain[field]);

    var state = GND.map.svg.selectAll('.state')
        .data(topojson.feature(states, states.objects.northeast).features);

    state
        .transition()
        .duration(300)
        .style("fill", GND.map.fillFunc);

    state
        .on('mouseover', function(d) {
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

GND.chart = {};

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

GND.chart.init = function(state) {
    GND.data['New England'].cases = GND.data['New England'].cases.slice(4);
    GND.data.Connecticut.cases = GND.data.Connecticut.cases.slice(4);

    if (typeof state === 'undefined') {
        state = 'New England';
    }

    GND.chart.x.domain(GND.chart.domain.slice(4));

    var data = GND.data[state].cases;


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

    var data = GND.data[state].cases;
    GND.chart.y.domain([0, d3.max(data, function(d) { return parseInt(d, 10); })]);
    var newData = [];
    for (i = 0; i < data.length; i++) {
        console.log(GND.chart.x.domain()[i]);
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

GND.init = function() {
    queue()
        .defer(d3.json, 'static/data/northeast.json')
        .defer(d3.json, 'static/data/lyme-data.json')
        .await(GND.map.loadAllData);
};

$('ul.map_selector li').on('click', function() {
    GND.map.field = $(this).attr('id');
    GND.map.loadData(GND.data, GND.map.field);
    GND.legend.update(GND.map.field);
    GND.stat.update(GND.map.field);
});

GND.init();

/* Modernizr 2.7.1 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-svg-load
 */
;window.Modernizr=function(a,b,c){function u(a){i.cssText=a}function v(a,b){return u(prefixes.join(a+";")+(b||""))}function w(a,b){return typeof a===b}function x(a,b){return!!~(""+a).indexOf(b)}function y(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:w(f,"function")?f.bind(d||b):f}return!1}var d="2.7.1",e={},f=b.documentElement,g="modernizr",h=b.createElement(g),i=h.style,j,k={}.toString,l={svg:"http://www.w3.org/2000/svg"},m={},n={},o={},p=[],q=p.slice,r,s={}.hasOwnProperty,t;!w(s,"undefined")&&!w(s.call,"undefined")?t=function(a,b){return s.call(a,b)}:t=function(a,b){return b in a&&w(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=q.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(q.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(q.call(arguments)))};return e}),m.svg=function(){return!!b.createElementNS&&!!b.createElementNS(l.svg,"svg").createSVGRect};for(var z in m)t(m,z)&&(r=z.toLowerCase(),e[r]=m[z](),p.push((e[r]?"":"no-")+r));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)t(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof enableClasses!="undefined"&&enableClasses&&(f.className+=" "+(b?"":"no-")+a),e[a]=b}return e},u(""),h=j=null,e._version=d,e}(this,this.document),function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))};

Modernizr.load({
    test: Modernizr.svg,
    nope: [ "static/css/no-svg.css" ]
});

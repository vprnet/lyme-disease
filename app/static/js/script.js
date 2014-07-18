var GND = GND || {};
GND.chart = {};
GND.counties = {};

GND.loadAllData = function(error, chartData, vt, mapData) {
    GND.chart.data = chartData;
    GND.chart.init('Northern New England', chartData);
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
    var state = GND.chart.selectorMap[$(this).text()];
    GND.chart.update(state);
    $('h4.chart_label').text(GND.chart.selectorMap[$(this).text()]);
});

function type(d) {
  d.value = +d.value; // coerce to number
  return d;
}

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

GND.counties.years = ['1999', '2000', '2001', '2002', '2003', '2004', '2005', '2006',
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

/* Modernizr 2.7.1 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-svg-load
 */
;window.Modernizr=function(a,b,c){function u(a){i.cssText=a}function v(a,b){return u(prefixes.join(a+";")+(b||""))}function w(a,b){return typeof a===b}function x(a,b){return!!~(""+a).indexOf(b)}function y(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:w(f,"function")?f.bind(d||b):f}return!1}var d="2.7.1",e={},f=b.documentElement,g="modernizr",h=b.createElement(g),i=h.style,j,k={}.toString,l={svg:"http://www.w3.org/2000/svg"},m={},n={},o={},p=[],q=p.slice,r,s={}.hasOwnProperty,t;!w(s,"undefined")&&!w(s.call,"undefined")?t=function(a,b){return s.call(a,b)}:t=function(a,b){return b in a&&w(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=q.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(q.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(q.call(arguments)))};return e}),m.svg=function(){return!!b.createElementNS&&!!b.createElementNS(l.svg,"svg").createSVGRect};for(var z in m)t(m,z)&&(r=z.toLowerCase(),e[r]=m[z](),p.push((e[r]?"":"no-")+r));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)t(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof enableClasses!="undefined"&&enableClasses&&(f.className+=" "+(b?"":"no-")+a),e[a]=b}return e},u(""),h=j=null,e._version=d,e}(this,this.document),function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))};

Modernizr.load({
    test: Modernizr.svg,
    nope: [ "static/css/no-svg.css" ]
});

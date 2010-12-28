Array.max = function( array ){
    return Math.max.apply( Math, array );
};
Array.min = function( array ){
    return Math.min.apply( Math, array );
};

// hay que meter los extents de cada polygono en sus properties
// al pedo calcularlo todo el tiempo
var featureExtents = function(feature) {
    var x = Array();
    var y = Array();
    var coords = feature.data.geometry.coordinates;
    var points = $.map(coords, function(a){return a});
    if (feature.data.geometry.type == 'MultiPolygon') points = $.map(points, function(a){return a});
    // var points = $.map(polygons, function(a){return a});
    $.map(points, function(a){
              if(!isNaN(a[0])){x.push(a[0])}; 
              if(!isNaN(a[1])){y.push(a[1])};
	  });
    
    xMax = Array.max(x);
    xMin = Array.min(x);
    yMax = Array.max(y);
    yMin = Array.min(y);
    return [{lon:xMin,lat:yMin},{lon:xMax,lat:yMax}];
    //  map.extent([{lon:xMin,lat:yMin},{lon:xMax,lat:yMax}])
};

var loadProvincias = function(e) {
    for (var i = 0; i < e.features.length; i++) {
	var feature = e.features[i];

	jQuery.data(feature.element, 'originalClass', 'color' + ((i % 5) + 1));
        feature.element.setAttribute('class', 'color' + ((i % 5) + 1));

        var name = feature.data.properties.ADMIN_NAME;
       	jQuery.data($("#menu li a:contains('" + name.toUpperCase() + "')")[0], 'feature', feature);
    }
};

var loadDepartamentos = function(e) {
    for (var i = 0; i < e.features.length; i++) {
	var feature = e.features[i];
	feature.element.setAttribute('class', 'dpto');
    }
};


var po = org.polymaps;

var map = po.map()
    .container(document.getElementById("map").appendChild(po.svg("svg")))
    .center({lat: -38, lon: -56})
    .zoomRange([3, 12])
    .zoom(4)
    .add(po.interact());



map.add(po.image()
	.url(po.url("http://{S}tile.cloudmade.com"
		    + "/1a1b06b230af4efdbb989ea99e9841af" // http://cloudmade.com/register
		    + "/20760/256/{Z}/{X}/{Y}.png")
	     .hosts(["a.", "b.", "c.", ""])));


var provincias = map.add(po.geoJson()
			 .url("provincias.json")
			 .tile(false).on('load', loadProvincias));

map.add(po.compass()
	.pan("none"));


$(document).ready(function() {
		      $('#menu li a').mouseover(function(e) {
						    var f = jQuery.data($(this)[0], 'feature').element;
						    f.setAttribute('class', 'provinciaFoco');
						})
                                     .mouseout(function(e) {
						   var f = jQuery.data($(this)[0], 'feature').element;
						   f.setAttribute('class', jQuery.data(f, 'originalClass'));
					       })
		                     .click(function(e) {
						var f = jQuery.data($(this)[0], 'feature');
						var fext = featureExtents(f);
						fext[0].lon -= 2;
						fext[1].lon += 2;
						map.extent(fext);
						// get json para los departamentos
                                                map.add(po.geoJson()
							.url("provincias/" + f.data.properties.ADMIN_NAME.toUpperCase() + ".json").tile(false).on('load', loadDepartamentos));
					
					    });
		       
});







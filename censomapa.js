var featureExtents = function(feature) {
    var b = feature.data.properties.bounds;
    return [{lon:b[0],lat:b[1]},{lon:b[2],lat:b[3]}];
};

var loadProvincias = function(e) {
    for (var i = 0; i < e.features.length; i++) {
	var feature = e.features[i];

	jQuery.data(feature.element, 'originalClass', 'color' + ((i % 5) + 1));
        feature.element.setAttribute('class', 'color' + ((i % 5) + 1));

	var name = feature.data.properties.provincia;
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
    .url(po.url("http://{S}tile.openstreetmap.org/{Z}/{X}/{Y}.png")
        .hosts(["a.", "b.", "c.", ""])));


map.add(po.geoJson()
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
						map.extent(featureExtents(f));
						// get json para los departamentos
                                                map.add(po.geoJson()
							.url("provincias/" + f.data.properties.provincia.toUpperCase() + ".json")
                                                        .tile(false)
                                                        .on('load', loadDepartamentos));
					
					    });
		       
});







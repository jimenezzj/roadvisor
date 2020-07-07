const mainWrapper= document.querySelector('.wrapperContainer');
var cont = 0;
mapboxgl.accessToken = 'pk.eyJ1Ijoia2F6ZSIsImEiOiJjazkwc3JxMjgwNG8zM2ZvNjMza2p5cnBxIn0.1_bogSbbiGoEgtDegfkLPg';
var map = new mapboxgl.Map({
    container: 'map', // Especifico el ID del contenedor
    style: 'mapbox://styles/mapbox/streets-v11', // Especifico el estilo del mapa
    center: [-84.03116608099936, 9.932827376420036], // Especifico las coordenadas adonde inicia el mapa
    zoom: 14.5, // Especifico el zoom inicial
});
var draw = new MapboxDraw({
    displayControlsDefault: false, //Muestro solo las herramientas que necesito
    controls: {
        line_string: true,
        trash: true
    },
    styles: [{
            "id": "linea",
            "type": "line",
            "layout": {
                "line-cap": "round",
                "line-join": "round"
            },
            "paint": {
                "line-color": "#438EE4",
                "line-dasharray": [0.2, 2],
                "line-width": 4,
                "line-opacity": 0.7
            }
        },
        {
            "id": "punto",
            "type": "circle",
            "paint": {
                "circle-radius": 8,
                "circle-color": "#438EE4",
            }
        }
    ]
});
map.addControl(draw);
map.on('draw.create', obtenerInicioFinal);
map.on('draw.update', obtenerInicioFinal);
map.on('draw.delete', removerRuta);


function obtenerInicioFinal() {
    var profile = "driving"; // El perfil de la ruta
    var data = draw.getAll(); // Se obtienen las coordenadas dibujadas en el mapa
    var lastFeature = data.features.length - 1;
    var coords = data.features[lastFeature].geometry.coordinates;
    var newCoords = coords.join(';'); // Se le da formato a las coordenadas
    var radius = []; // Se le da de radio a las coordenadas de 25 metros
    coords.forEach(element => { //ENVIAR COORDS A LA BASE DE DATOS MEDIANTE UN FETCH POST
        radius.push(25);
    });
    console.log("Punto de inicio y final para salvar en la base de datos: " + coords);
    obtenerRuta(newCoords, radius, profile);
    localStorage.setItem('coordenadasGuardadas', coords);
}





function obtenerRuta(coordinates, radius, profile) {
    var radiuses = radius.join(';')
    var query = 'https://api.mapbox.com/matching/v5/mapbox/' + profile + '/' + coordinates + '?geometries=geojson&radiuses=' + radiuses + '&steps=true&access_token=' + mapboxgl.accessToken;

    fetch(query)
        .then(function(response) {
            return response.json();
        })
        .then(function(json) {
            var coords = json.matchings[0].geometry; //DIBUJAR COORDS.COORDINATES A TRAVES DE UN FETCH CON UN GET
            console.log("Coordenadas para pintar la ruta: " + coords.coordinates);
            pintarRuta(coords);
        });
}

function pintarRuta(coords) {
    map.addLayer({
        "id": "route",
        "type": "line",
        "source": {
            "type": "geojson",
            "data": {
                "type": "Feature",
                "geometry": coords
            }
        },
        "layout": {
            "line-join": "round",
            "line-cap": "round"
        },
        "paint": {
            "line-color": "#03AA46",
            "line-width": 4,
            "line-opacity": 0.8
        }
    });
}

function removerRuta() {
    if (map.getSource('route')) {
        map.removeLayer('route');
        map.removeSource('route');
    } else {
        return;
    }
}

map.on('draw.delete', removerRuta);


function agregarRuta() {
    var data = {
        nombreRuta: document.getElementById('nombreRuta').value,
        provinciaRuta: document.getElementById("provinciaRuta").options[document.getElementById("provinciaRuta").selectedIndex].value,
        puntoInicio: document.getElementById('puntoInicio').value,
        puntoFinal: document.getElementById('puntoFinal').value,
        status: true
       
    };
    //VARIABLES DE LOS DATOS DE LA RUTA PARA HACER VALIDACIONES
    var nombreRuta = document.getElementById('nombreRuta').value;
    var provinciaRuta = document.getElementById('provinciaRuta').selectedIndex;
    var puntoInicio = document.getElementById('puntoInicio').value;
    var puntoFinal = document.getElementById('puntoFinal').value;
    localStorage.setItem('nombreRuta', document.getElementById('nombreRuta').value);

    if (nombreRuta == "" || provinciaRuta == 0 || puntoInicio == "" || puntoFinal == "") {
        alert('Debe llenar todos los campos');
    } else {

        fetch('/rutas/add', {
                method: 'POST', // or 'PUT'
                body: JSON.stringify(data), // data can be `string` or {object}!
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {

                return res.json();
            })
            .then(response => {
                alert("Registro Confirmado");
            })
            .catch(error => console.error('Error:', error));
    }
}

function registrarCoordenadas() {
    var coordenadas = localStorage.getItem('coordenadasGuardadas');
    var nombreRuta = localStorage.getItem('nombreRuta');
    console.log('aqui va nombre de la ruta: ' + nombreRuta);
    console.log('aqui van coordenadas: ' + coordenadas);

    fetch('/rutas/encontrarRuta', {
            method: 'PUT',
            body: JSON.stringify({ coordenadas: coordenadas, nombreRuta: nombreRuta }),
            headers: { "content-type": "application/json" }
        })
        .then(function(result) {
            return result.json();
            console.log(result);
        })
        .then(function(data) {
            fetch('/rutas/nuevasCoordenadas', {
                    method: 'POST',
                    body: JSON.stringify({ coordenadas: coordenadas, nombreRuta: nombreRuta, status: true }),
                    headers: { "content-type": "application/json" }
                })
                .then(function(result) {
                    return result.json();
                })
                .then(function(data) {
                    if (data.status != 404) {
                        console.log('Todo ha salido bien');
                        localStorage.removeItem('nombreRuta');
                        localStorage.removeItem('coordenadasGuardadas')

                    } else {
                        console.log('algo ha salido mal');
                    }
                })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            return res.status(err.statusCode).json({
                message: err.message,
                statusCode: err.statusCode,
            });
        });
}
/**************************************************************** */
mainWrapper.querySelector('header').appendChild(
    createSidebar(getNavbarOpts)
);

mainWrapper.querySelector('main').insertBefore(
    createTopNavbar(
        'Rutas',
        getTopNavOpts(),
        [
            {
                icon: 'account_circle',
                name: 'Mi Perfil',
                href: getCurrentURL + 'modules/perfil/perfil.html'
            },
            {
                icon: 'settings',
                name: 'Configuración',
                href: getCurrentURL + 'modules/configuracion/configuracion.html'
            },
            {
                icon: 'exit_to_app',
                name: 'Cerrar Sesión',
                href: '#',
                action: logOutUser
            }
        ]
    ),
    document.querySelector('.textoRutaAceesso')
);

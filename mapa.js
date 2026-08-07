const limitesAmericas = L.latLngBounds(
    L.latLng(-58, -170),
    L.latLng(75, -25)   
);

const map = L.map('map', {
    minZoom: 3,                        
    maxBounds: limitesAmericas,       
    maxBoundsViscosity: 1.0            
}).setView([-15, -60], 3);             

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    noWrap: true,                     
    bounds: limitesAmericas,    
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);



fetch('ecorregiones.json') 
    .then(response => {
        if (!response.ok) throw new Error("No se encontró el archivo del mapa");
        return response.json();
    })
    .then(data => {
        console.log("¡Capa cargada con éxito!", data);
        
        const capa = L.geoJSON(data, {
            style: {
                color: "#2c3e50",
                weight: 1.5,
                fillColor: "#73b324",
                fillOpacity: 0.4
            }
        }).addTo(map);

        map.fitBounds(capa.getBounds());
    })
    .catch(err => {
        console.error("Error en el fetch:", err);
    });
/*
CHEQUEAR ESTO!!!!
function ubicarDispositivo() {
    if (!navigator.geolocation) {
        alert("Tu navegador no soporta la geolocalización.");
        return;
    }

    const opciones = {
        enableHighAccuracy: true,
        timeout: 5000,          
        maximumAge: 0            
    };

    navigator.geolocation.getCurrentPosition(
        (posicion) => {
            const lat = posicion.coords.latitude;
            const lon = posicion.coords.longitude;

            if (limitesAmericas.contains([lat, lon])) {
                map.setView([lat, lon], 16);
                L.marker([lat, lon])
                    .addTo(map)
                    .bindPopup('<b>¡Te encontramos!</b><br>Estás aquí.')
                    .openPopup();
            } else {
                console.log("El usuario está fuera de los límites de las Américas.");
            }
        },
        (error) => {
            console.warn(`Error de geolocalización (${error.code}): ${error.message}`);
        },
        opciones
    );
}

ubicarDispositivo();
*/
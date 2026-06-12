// 1. Inicializar el mapa con una vista por defecto (de respaldo)
// [latitud, longitud], zoom
const map = L.map('map').setView([-34.6037, -58.3816], 13); 

// 2. Agregar la capa de OpenStreetMap (la que compartiste)
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// 3. Función para detectar y centrar la ubicación del dispositivo
function ubicarDispositivo() {
    // Verificar si el navegador soporta Geolocalización
    if (!navigator.geolocation) {
        alert("Tu navegador no soporta la geolocalización.");
        return;
    }

    // Configuración opcional para mayor precisión
    const opciones = {
        enableHighAccuracy: true, // Fuerza al dispositivo a usar GPS si está disponible
        timeout: 5000,           // Tiempo máximo de espera (5 segundos)
        maximumAge: 0            // No usar una ubicación vieja guardada en caché
    };

    // Intentar obtener las coordenadas
    navigator.geolocation.getCurrentPosition(
        (posicion) => {
            const lat = posicion.coords.latitude;
            const lon = posicion.coords.longitude;

            // Centrar el mapa en la ubicación real con un zoom de 16
            map.setView([lat, lon], 16);

            // Opcional: Colocar un marcador en donde está el usuario
            L.marker([lat, lon])
                .addTo(map)
                .bindPopup('<b>¡Te encontramos!</b><br>Estás aquí.')
                .openPopup();
        },
        (error) => {
            // Manejo de errores (por si el usuario rechaza el permiso)
            console.warn(`Error de geolocalización (${error.code}): ${error.message}`);
        },
        opciones
    );
}

// 4. Ejecutar la función automáticamente al cargar la página
ubicarDispositivo();
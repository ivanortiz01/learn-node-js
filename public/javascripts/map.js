var map = L.map('map').setView([3.395065, -76.527833], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// L.marker([ 3.42158, -76.5205]).addTo(map)
//     .bindPopup('This is a test')
//     .openPopup();

$.ajax({
    datatype: "json",
    url: "/api/bicicletas",
    success: function(data) {
        console.log(data);
        data.bicicletas.forEach(function(bici) {
            L.marker(bici.ubicacion).addTo(map)
                .bindPopup(bici.id)
        })
    }
})
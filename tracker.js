var config = {
    apiKey: "AIzaSyBmYjLdPu0mAJcjxh-uXEHiRdueg0qziAc",
    authDomain: "crud-web-2ec66.firebaseapp.com",
    databaseURL: "https://cmv-taxi-8bbab-default-rtdb.firebaseio.com/",
    projectId: "crud-web-2ec66",
    storageBucket: "crud-web-2ec66.appspot.com",
    messagingSenderId: "170659413593",
    appId: "1:170659413593:web:d3bf853e0a9f20c3133b48",
    measurementId: "G-X7PW818489"
};
firebase.initializeApp(config);

// counter for online cars...
var cars_count = 0;

// markers array to store all the markers, so that we could remove marker when any car goes offline and its data will be remove from realtime database...
var markers = [];
var map;

// Google Map Initialization... 
function initMap() { 
    coordenadas = {
        lat: -12.2082984,
        lng: -76.9459916
    }
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 12,
        center: coordenadas,
    });
}

// Mostrar marcador en el mapa
function AddCar(data) {

    var icon = { // car icon
        path: 'M29.395,0H17.636c-3.117,0-5.643,3.467-5.643,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759   c3.116,0,5.644-2.527,5.644-5.644V6.584C35.037,3.467,32.511,0,29.395,0z M34.05,14.188v11.665l-2.729,0.351v-4.806L34.05,14.188z    M32.618,10.773c-1.016,3.9-2.219,8.51-2.219,8.51H16.631l-2.222-8.51C14.41,10.773,23.293,7.755,32.618,10.773z M15.741,21.713   v4.492l-2.73-0.349V14.502L15.741,21.713z M13.011,37.938V27.579l2.73,0.343v8.196L13.011,37.938z M14.568,40.882l2.218-3.336   h13.771l2.219,3.336H14.568z M31.321,35.805v-7.872l2.729-0.355v10.048L31.321,35.805',
        scale: 0.8,
        fillColor: "#427af4", //<-- Car Color, you can change it 
        fillOpacity: 1,
        strokeWeight: 1,
        anchor: new google.maps.Point(0, 5),
        rotation: data.val().angle //<-- Angulo de car
    };

    var ubicacion = {
        lat: parseFloat(data.val().lat),
        lng: parseFloat(data.val().lng)
        // lat: -12.0836,
        // lng: -76.9852
    };
    console.log("New lat lng: " + parseFloat(data.val().lat) + " " + (data.val().lng))

    // ===Add marker=== new google.maps.Marker SlidingMarker
    var marker = new google.maps.Marker({
        map: map,
        position: ubicacion,
        icon: icon
        //icon:'taxi_conectado.png',
        
    });

    markers[data.key] = marker; // Agregar marker en el array
    document.getElementById("cars").innerHTML = cars_count;
}

// get firebase database reference (Apuntar al nodo)
//var cars_Ref = firebase.database().ref('/');
var cars_Ref = firebase.database().ref().child('conductores');

// Este Evento se activa cuando se agrega nuevo objeto en la DB
cars_Ref.on('child_added', function (data) {
    cars_count++;
    AddCar(data);
});

// Este evento se activa cuando hay cambio de ubicacion de los carros
cars_Ref.on('child_changed', function (data) {
    markers[data.key].setMap(null);
    AddCar(data);
});

//Si algún automóvil se desconecta, este evento se activará y eliminaremos el marcador de ese automóvil
cars_Ref.on('child_removed', function (data) {
    markers[data.key].setMap(null);
    cars_count--;
    document.getElementById("cars").innerHTML = cars_count;
});
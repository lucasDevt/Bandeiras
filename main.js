Webcam.set({
    width: 350,
    height: 300,
    image_format: "jpeg",
    jpeg_quality: 90
});
var camera = document.getElementById("camera");
Webcam.attach('#camera');


let myGlobe;
function setupGlobe() {
    myGlobe = Globe()(document.getElementById("globe-container"))
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
        .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
        .pointAltitude(0.1)
        .pointRadius(0.5)
        .pointColor(() => 'red');
}
setupGlobe();

function takeSnapshot() {
    Webcam.snap(function (data_uri) {
        document.getElementById("resultado").innerHTML = '<img id="bandeira" src="' + data_uri + '"/>'
    })
}
let classifier = ml5.imageClassifier('https://teachablemachine.withgoogle.com/models/ug11kUZEN/model.json', modelLoaded);
function modelLoaded() {
    console.log("modelo carregado")
}
function check() {
    let getImage = document.getElementById("bandeira")
    classifier.classify(getImage, gotResult)

}
function gotResult(error, results) {
    if (error) {
        console.error(error)
    } else {
        console.log(results)
        document.getElementById("resultname").innerHTML = results[0].label
        document.getElementById("accuracy").innerHTML = results[0].confidence.toFixed(3)
        let countryCoords = {
            "Canadá": { latitude: 45.4215, longitude: -75.6972 },
            "Japão": { latitude: 35.6762, longitude: 139.6503 },
            "Brasil": { latitude: -15.7975, longitude: -47.8919 },
            "Espanha": { latitude: 40.4168, longitude: -3.7038 },
            "Portugal": { latitude: 38.7223, longitude: -9.1393 }
        }
        let country = results[0].label
        if (countryCoords.hasOwnProperty(country)){
            let coords = countryCoords[country]
            showCountryOnGlobe (coords.latitude,coords.longitude)
        }
    }
}
function showCountryOnGlobe (lat,lon){
    myGlobe.pointOfView({lat:lat, lng:lon,altitude:0.3}, 1000)
    myGlobe.pointsData([{lat,lon,size:1,color:"red"}])
}
myGlobe.controls().enableZoom = true
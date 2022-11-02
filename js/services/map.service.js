import { locService } from './loc.service.js'

export const mapService = {
    initMap,
    addMarker,
    panTo,
    centerMap,
    goToLocation,
    renderMarkers
}


// Var that is used throughout this Module (not global)
var gMap

function initMap(lat = 32.0749831, lng = 34.9120554) {
    return _connectGoogleApi()
        .then(() => {
            console.log('google available')
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                    center: { lat, lng },
                    zoom: 15
                })
            gMap.addListener('click', (ev) => {

                onClickMap(ev, gMap)
            })
        })
}

function renderMarkers() {
    const locations = locService.getLocs()
    console.log(locations);
    // locations.forEach(location => {
    //     console.log(location);
    // })
}

function addMarker(lat, lng) {
    var marker = new google.maps.Marker({
        position: {
            lat,
            lng
        },
        title: 'Hello World!'
    })
    marker.setMap(gMap)
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng)
    gMap.panTo(laLatLng)
}

function centerMap(lat, lng) {
    gMap.setCenter(new google.maps.LatLng(lat, lng))
    addMarker(lat, lng)
}

function goToLocation(id) {
    const currLocation = locService.getLocById(id)
    console.log(currLocation);
    centerMap(currLocation.lat, currLocation.lng)
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyCbtnlyrtW4iXwODCftA7jSm_UMfPEu-cA'
    var elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}
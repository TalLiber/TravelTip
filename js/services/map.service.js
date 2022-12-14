import { locService } from './loc.service.js'

export const mapService = {
    initMap,
    addMarker,
    panTo,
    goToKeywordLocation,
    centerMap,
    goToLocation,
    renderMarkers
}

const API_KEY = 'AIzaSyCbtnlyrtW4iXwODCftA7jSm_UMfPEu-cA'


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
                // onClickMap(ev, gMap)
                openModalToMap(ev)

            })
        })
}

function openModalToMap(ev) {
    const contentString = `
<div class="modal">
    <h1>Good Morning Arnon</h1>
</div>`


    console.log(ev);
    const pos = {
        lat: ev.latLng.lat(),
        lng: ev.latLng.lng()
    }

    const infowindow = new google.maps.InfoWindow({
        content: contentString,
        position: pos,

    });

    infowindow.open(gMap)
}

function renderMarkers() {
    locService.getLocs()
        .then(locs => {
            // console.log('Locations:', locs)
            locs.forEach(location => {
                addMarker(location.lat, location.lng)
            })
        })

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
    centerMap(currLocation.lat, currLocation.lng)
}

function goToKeywordLocation(place) {
    console.log(place)
    let api = `https://maps.googleapis.com/maps/api/geocode/json?address=${place}&key= AIzaSyCzZ1U0nG3bfA5VF6Fia8uQy19bPRjDMGU`
    return axios.get(api)
        .then((res) => {
            // console.log(res.data['results'][0]['geometry'])
            return getRelevantData(res.data['results'])
        })
        .catch(err => console.log(err))
}

function getRelevantData(results) {
    return results[0]['geometry']['location']
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()

    var elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}


//tal api key
// AIzaSyCbtnlyrtW4iXwODCftA7jSm_UMfPEu-cA
//AIzaSyDhYzgLnfBxl85AUqjBAdnlnVwedFVbP-M

// arnon api
// AIzaSyCzZ1U0nG3bfA5VF6Fia8uQy19bPRjDMGU

// https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyDhYzgLnfBxl85AUqjBAdnlnVwedFVbP-M
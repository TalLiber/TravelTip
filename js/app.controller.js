import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.renderLocs = renderLocs
window.onGetUserPos = onGetUserPos
window.onRemoveLocation = onRemoveLocation
window.onGoToLocation = onGoToLocation

function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready')
            renderLocs()
        })
        .catch(() => console.log('Error: cannot init map'))
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos')
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onAddMarker() {
    console.log('Adding a marker')
    mapService.addMarker({ lat: 32.0749831, lng: 34.9120554 })
}

function renderLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            const strHTMLs = locs.map(loc => `
                <article class="location-container">
                    <div>${loc.name}</div>
                    <small>createdAt</small> //TODO: add createdAt here
                    <button onclick="onGoToLocation('${loc.id}')">Go</button>
                    <button onclick="onRemoveLocation('${loc.id}')">Remove</button>
                </article>
            `).join('')
            document.querySelector('.locations-list').innerHTML = strHTMLs
        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords)
            mapService.goToUserLocation(pos.coords)
        })
        .catch(err => {
            console.log('err!!!', err)
        })
}

function onRemoveLocation(id) {
    locService.removeLocation(id)
    renderLocs()
}

function onGoToLocation(id) {
    mapService.goToLocation(is)
}

function onPanTo() {
    console.log('Panning the Map')
    mapService.panTo(35.6895, 139.6917)
}
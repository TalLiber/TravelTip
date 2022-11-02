import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.renderLocs = renderLocs
window.onGetUserPos = onGetUserPos
window.onClickMap = onClickMap
window.onSaveLocation = onSaveLocation
window.onRemoveLocation = onRemoveLocation
window.onGoToLocation = onGoToLocation
window.onSetLocationByInput = onSetLocationByInput

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

function onClickMap(ev, map) {
    const elInput = document.querySelector('.name-form input')
    elInput.dataset.lat = + ev.latLng.lat()
    elInput.dataset.lng = + ev.latLng.lng()

    const { offsetX, offsetY } = ev.domEvent
    placeModalByPos(offsetX, offsetY)
}

function onSaveLocation(ev) {
    ev.preventDefault()
    document.querySelector('.map-modal').hidden = true
    const elForm = ev.target
    const formData = new FormData(elForm)
    const name = Object.fromEntries(formData)['loc-name-input']
    const elInput = elForm.querySelector('input')

    locService.setLocation(name, +elInput.dataset.lat, +elInput.dataset.lng)
}
function onSetLocationByInput(ev) {
    ev.preventDefault()
    const elForm = ev.target
    const formData = new FormData(elForm)
    const place = Object.fromEntries(formData)['search-input']
    // const locPrm =
     mapService.goToKeywordLocation(place)


}

function placeModalByPos(x, y) {
    const elModal = document.querySelector('.map-modal')
    elModal.hidden = false
    elModal.style.left = x + 'px';
    elModal.style.top = y + 'px';

}
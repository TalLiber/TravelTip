import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetLocs = onGetLocs
window.onGetUserPos = onGetUserPos
window.onClickMap = onClickMap
window.onSaveLocation = onSaveLocation

function onInit() {
    mapService.initMap()
        .then(() => {
            console.log('Map is ready')
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

function onGetLocs() {
    locService.getLocs()
        .then(locs => {
            console.log('Locations:', locs)
            const strHTMLs = locs.map(loc => `
                <article class="location-container">
                    <div>${loc.name}</div>
                    <small>TODO: add createdAt here</small>
                </article>
            `).join('')
            document.querySelector('.locations-list').innerHTML = strHTMLs
        })
}

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords)
            document.querySelector('.user-pos').innerText =
                `Latitude: ${pos.coords.latitude} - Longitude: ${pos.coords.longitude}`
        })
        .catch(err => {
            console.log('err!!!', err)
        })
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

    return {
        name,
        lat: +elInput.dataset.lat,
        lng: +elInput.dataset.lng,
        createdAt: Date.now()
    }
}

function placeModalByPos(x, y) {
    const elModal = document.querySelector('.map-modal')
    elModal.hidden = false
    elModal.style.left = x + 'px';
    elModal.style.top = y + 'px';

}
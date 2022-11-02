import { storageService } from './storage.service.js'

export const locService = {
    getLocs,
    setLocation,
    removeLocation,
    getLocById
}

const KEY = 'travelTipDB'

var gLocs = storageService.load(KEY) || [
    { id: '123', name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
    { id: '234', name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

function setLocation(name, lat, lng, createdAt) {
    gLocs.push({
        id: _makeId(),
        name,
        lat,
        lng,
        createdAt: Date.now()
    })

    storageService.save(KEY, gLocs)
}

function removeLocation(id) {
    const currLocIdx = gLocs.findIndex(loc => loc.id === id)
    gLocs.splice(currLocIdx, 1)
    storageService.save(KEY, gLocs)
}

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(gLocs)
        }, 2000)
    })
}

function getLocById(id) {
    return gLocs.find(loc => loc.id === id)
}

function _makeId(length = 6) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var txt = ''
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}
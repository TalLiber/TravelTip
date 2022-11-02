import { storageService } from './storage.service.js'

export const locService = {
    getLocs,
    setLocation
}

const KEY = 'travelTipDB'

var gLocs = storageService.load(KEY) || [
    { name: 'Greatplace', lat: 32.047104, lng: 34.832384 },
    { name: 'Neveragain', lat: 32.047201, lng: 34.832581 }
]

function setLocation(name, lat, lng, createdAt) {
    gLocs.push({
        id: _makeId(),
        name,
        lat,
        lng,
        createdAt
    })

    storageService.save(KEY, gLocs)
}

function getLocs() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(gLocs)
        }, 2000)
    })
}

function _makeId(length = 6) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    var txt = ''
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}
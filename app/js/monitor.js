const path = require('path')
const osu = require('node-os-utils')
const cpu = osu.cpu
const mem = osu.mem
const os = osu.os

let cpuOverload = 5
let alertFrequency = 1

// Notify User
// notifyUser({
//     title: 'CPU Overload',
//     body: `CPU is over ${cpuOverload}%`,
//     icon: path.join(__dirname, 'img', 'icon.png')
// })

// Run every 2 seconds
setInterval(() => {
    // CPU Usage
    cpu.usage().then(info => {
        document.getElementById('cpu-usage').innerText = `${info}%`

        document.getElementById('cpu-progress').style.width = `${info}%`

        // Make progress bar red if overload
        if (info >= cpuOverload) {
            document.getElementById('cpu-progress').style.background = "red"
        } else {
            document.getElementById('cpu-progress').style.background = "#30c88b"
        }

        // Check overload
        if (info >= cpuOverload && runNotify(alertFrequency)) {
            // Notify User
            notifyUser({
                title: 'CPU Overload',
                body: `CPU is over ${cpuOverload}%`,
                icon: path.join(__dirname, 'img', 'icon.png')
            })

            localStorage.setItem('lastNotify', +new Date())
        }
    })

    // Free CPU
    cpu.free().then(info => {
        document.getElementById('cpu-free').innerText = `${info}%`
    })

    // System Uptime
    document.getElementById('sys-uptime').innerText = secondsToDhms(os.uptime())
}, 2000)

// Set Model
document.getElementById('cpu-model').innerText = cpu.model()

// Set Computer Name
document.getElementById('comp-name').innerText = os.hostname()

// OS
document.getElementById('os').innerText = `${os.type()} ${os.arch()}`

// Total Memory
mem.info().then(info => {
    document.getElementById('mem-total').innerText = info.totalMemMb
})

// Show days, hours, mins, secs
function secondsToDhms(seconds) {
    seconds = +seconds
    const d = Math.floor(seconds/ (3600 * 24))
    const h = Math.floor((seconds % (3600 * 24)) /3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)
    return `${d}d, ${h}h, ${m}m, ${s}s`
}

// Send notification
function notifyUser(options) {
    new Notification(options.title, options)
}

// Check Time Passed since notification
function runNotify(frequency) {
    if (localStorage.getItem('lastNotify') === null) {
        // Store timestamp
        localStorage.setItem('lastNotify', +new Date())
        return true
    }

    const notifyTime = new Date(parseInt(localStorage.getItem('lastNotify')))
    const now = new Date()
    const diffTime = Math.abs(now - notifyTime)
    const minutesPassed = Math.ceil(diffTime / (1000 * 60))

    if (minutesPassed > frequency) {
        return true
    } else {
        return false
    }
}
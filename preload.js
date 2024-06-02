const { ipcRenderer } = require("electron")
console.log('preload.js loaded')
window.onload = () => {
    const btn = document.getElementById('btn')
    const urlInput = document.getElementById('url')
    urlInput.value = ipcRenderer.sendSync('get-url')
    btn.onclick = (e) => {
        ipcRenderer.send('set-url', urlInput.value)
        alert("saved?!")
    }
}
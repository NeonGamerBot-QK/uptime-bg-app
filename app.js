const {app, BrowserWindow,  Menu, Tray, shell, ipcMain} = require('electron')
const cron = require('node-cron')
const path = require('path')
const Store = require('electron-store')
app.setPath('userData', __dirname + '/data')
const store = new Store({
    fileExtension: 'json',
    name: 'app',
    defaults: {
        url: 'https://uptime.kuma.com/',
        time: `* * * * *`
    },
    beforeEachMigration: (store, context) => {
		console.log(`[main-config] migrate from ${context.fromVersion} → ${context.toVersion}`);
	}
})
cron.schedule(store.get('time'), () => {
    fetch(store.get('url'), {})
    })
let tray = null

const exeName = path.basename(process.execPath);
app.setLoginItemSettings({
openAtLogin: true,
path: process.execPath,
args: [
'--processStart', `${exeName}`,
'--process-start-args', "--hidden"
]
});

ipcMain.on('get-url', (event) => {
    event.returnValue = store.get('url')
})
ipcMain.on('set-url', (event, arg) => {
    store.set('url', arg)
})
function createWindow() {
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
        nodeIntegration: true,
        preload: path.join(__dirname, 'preload.js')
        },
        icon: path.join(__dirname, 'icon.jpg')
        })
        win.loadFile('settings.html')
}
app.on('ready', () => {
console.log(`App Running`)
tray = new Tray(__dirname + '/icon.jpg')
const contextMenu = Menu.buildFromTemplate([
  { label: 'Change URL', type: 'normal', click: createWindow  },
  { label: 'Quit', type: 'radio', click: () => { app.quit() }},
  { type: 'separator'},
  { label: 'Made by saahil', type: 'normal', click: () => {
    shell.openExternal('https://saahild.com/')
  } }
])
tray.setToolTip('Uptime Kuma')
tray.setContextMenu(contextMenu)
})
app.on('window-all-closed', () => {
    // noop it because default is to quit the app
    console.log(`DO NOT EXIT`)
    // if (process.platform !== 'darwin') {
    //     app.quit()
    // }
})


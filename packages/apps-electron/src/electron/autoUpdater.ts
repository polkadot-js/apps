export function setupAutoUpdater () {
  const { autoUpdater } = require('electron-updater');

  setLogger(autoUpdater)
  autoUpdater.checkForUpdatesAndNotify()
}

function setLogger (autoUpdater: any) {
  const log = require('electron-log')
  log.transports.file.level = "debug"
  autoUpdater.logger = log
}

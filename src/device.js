let device
// Use the Netcast object
if (!import.meta.env.DEV) {
  device = document.getElementById('device')
}
// Use dummy config
else {
  device = {
    modelName: 'Testing',
    serialNumber: 'yBadWDO9trLhda75V6qqh5BBrrEpsdTwJYKQnr23vehsnGC7Mr72svaf41FOVChN'
  }
}

export default device

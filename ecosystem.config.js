module.exports = {
  apps: [{
  name: 'rhythm-saber-server',
  script: './index.js',
  instances: 1,
  exec_mode: 'fork'
  }]
}
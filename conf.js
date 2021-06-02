// conf.js
exports.config = {
  framework: 'jasmine',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['pulseTest.js'],
  capabilities: { 
    browserName: 'chrome', 
    chromeOptions: {
      args: ['--ignore-certificate-errors', "--allow-insecure-localhost"]
    }
  },
  allScriptsTimeout: 30000,
  params: {
    inFile: 'newTest.csv',
    outFile: 'same',
    ip: '172.17.53.253',
    user: 'admin',
    password: 'admin',
  }
}
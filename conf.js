// conf.js
exports.config = {
  onPrepare: function() {
    if (browser.params.ip == 'none' || browser.params.file == 'none') {
      console.log('\x1b[31m%s\x1b[0m', 'No IP address and/or file specified.');
      console.log('\x1b[36m%s\x1b[0m', `Parameters can be specified with "--params.parameter value" (no quotes):
      --params.ip           the web address of the pulse instance
      --params.file         the file to read from
      --params.outfile      the file to write to; if not specified, will write to the input file
      --params.username     the username to use on the login screen; default is admin
      --params.password     the password to use on the login screen; default is admin
      `);
      throw 'No IP address and/or file specified.';
    }
  },
  framework: 'jasmine',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['pulseTest.js'],
  capabilities: { 
    browserName: 'chrome', 
    chromeOptions: {
      args: ['--ignore-certificate-errors', "--allow-insecure-localhost"]
    }
  },
  allScriptsTimeout: 120000,
  params: {
    ip: 'none',
    file: 'none',
    outfile: 'same',
    username: 'admin',
    password: 'admin',
    overlaytimeout: 120000
  }
}
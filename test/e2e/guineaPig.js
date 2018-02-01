var config = require('../../nightwatch.conf.js');

module.exports = { // adapted from: https://git.io/vodU0
  'Guinea Pig Assert Title': function(browser) {
    browser
      .url('http://localhost:8000')
      .waitForElementVisible('body')
      .assert.title('Prueba')
      .saveScreenshot('guinea-pig-test.png')
      .end();
  }
};
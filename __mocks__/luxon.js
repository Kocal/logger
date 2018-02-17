const luxon = require('luxon');

luxon.DateTime.local = function () {
  return luxon.DateTime.fromISO('2018-02-17T08:30:00');
};

module.exports = luxon;

var LogEntry = require('./entities/LogEntry');

exports.log = function (faceId, givenName, isOk, userId) {
  var e = new LogEntry({
    faceId: faceId,
    givenName: givenName,
    isOk: isOk
  });
  //don't wait for save to end (we don't care)
  e.save(function (err) {
    if (err) {
      console.log(err);
    }
  });

};


exports.findMostFrequentCorrectAnswers = function (startDate, limit, callback) {
  LogEntry.aggregate(
    {
      $match: {
        date: {
          $gte: startDate
        },
        isOk: true
      }
    },
    {
      $group: {
        _id: '$faceId',
        count: {
          $sum: 1
        }
      }
    },
    {
      $sort: {
        'count': -1
      }
    },
    {
      $limit: limit
    }, function (err, res) {
      callback(res);
    });
};
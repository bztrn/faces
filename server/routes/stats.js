var _ = require('lodash');
var Q = require('q');

var Logs = require('../database/Logs');
var Faces = require('../database/Faces');
var FileUtils = require('../utils/FileUtils');

var getFacePromise = function (faceId) {
  var deferred = Q.defer();
  Faces.get(faceId).then(function (face) {
    var photo = Faces.getRandomPhotoPath(face);
    FileUtils.getImgBase64(photo).then(function (photo) {
      var newFace = face.toObject();
      newFace.photo = photo;
      deferred.resolve(newFace);
    });
  });
  return deferred.promise;
};

exports.getMostRecognizable = function (req, res) {
  var cachableTimeOffset = 60000;
  var time = cachableTimeOffset * (Math.floor((Date.now() - 1000 * 3600 * 24 * 7) / cachableTimeOffset));
  var startDate = new Date(time);

  var howMany = 5;
  Logs.findMostFrequentCorrectAnswers(startDate, howMany, function (mostFrequent) {
    Q.all(_.pluck(mostFrequent, '_id').map(getFacePromise)).then(function (faces) {
      var response = mostFrequent.map(function (val, key) {
        return {
          face: faces[key],
          counts: {
            correct: val.countCorrect,
            wrong: val.countWrong
          }
        };
      });

      res.send(response);
    });
  });
};
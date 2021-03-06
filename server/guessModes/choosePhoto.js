var _ = require('lodash');
var Faces = require('../database/Faces');
var FileUtils = require('../utils/FileUtils');
var Logs = require('../database/Logs');
var q = require('q');
var crypto = require('crypto');

var hashId = function (id) {
  return crypto.createHash('md5').update("Moja sul jest moja." + id + ".pieprzu troche tez. Kardamon i pieprz.").digest("hex");
};

exports.questionData = function (originalFace, query, callback) {
  return Faces.getRandom(3, query).then(function (additional) {
    var faces = [originalFace].concat(additional);
    var promises = faces.map(function (face) {
      return FileUtils.getImgBase64(Faces.getRandomPhotoPath(face));
    });
    return q.all(promises).then(function (images) {
      var models = _.map(images, function (image, idx) {
        return {
          _id: hashId(faces[idx]._id),
          photo: image
        }
      });
      callback('choosePhoto', _.omit(originalFace, 'photos', '_id'), _.shuffle(models));
    });
  });
};

exports.guess = function (face, input, callback) {
  var isOk = hashId(face._id) === input.answer;
  Logs.log(face._id, input.answer, isOk);
  callback({
    status: isOk ? 'correct' : 'wrong',
    face: face
  });
};
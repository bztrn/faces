'use strict';
import _ from 'lodash';
import servicesModule from './module';

export default servicesModule.factory('Faces', ($http) => {

  return {

    find: function (query, fields, sorting) {
      return $http.post('faces/find', {
        query: query,
        fields: fields,
        sorting: sorting
      }).then((response) => {
        return response.data;
      });
    },

    getDistinct: function (fieldname) {
      return $http.get('faces/distinct/' + fieldname).then((response) => {
        return response.data;
      });
    },

    getRandom: function () {
      return $http.get('faces/random');
    },

    checkName: function (face, mode, data) {
      data._id = face._id;
      data.mode = mode;
      return $http.post('faces/check', data);
    },

    getPopular: function () {
      return $http.get('faces/popular');
    }
  };
});
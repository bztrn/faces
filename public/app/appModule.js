'use strict';
import 'angular-ui-router';
import 'angular-material';
import 'angular-gravatar';
import 'angular-material-icons';
import 'ngStorage';
import angular from 'angular';
import quizModule from './quiz/index';
import faceModule from './face/index';
import servicesModule from './services/index';

export default angular.module('faces', [
  'ui.router',
  'ngMaterial',
  'ui.gravatar',
  'ngStorage',
  'ngMdIcons',
  quizModule.name,
  faceModule.name,
  servicesModule.name
]);

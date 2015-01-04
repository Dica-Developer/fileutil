/*global console, window*/
(function(window) {
  'use strict';

  function FileUtilCordova() {

    function readFileInDirectory(directory, filePath, fileContentCallback, errorCallback) {
      directory.getFile(filePath, {}, function(fileEntry) {
        fileEntry.file(function(file) {
          var reader = new FileReader();
          reader.onloadend = function(event) {
            fileContentCallback(event.target.result);
          };
          reader.onerror = function(e) {
            if (typeof errorCallback === 'function') {
              errorCallback(e);
            }
            console.error('Writing file ' + filePath + ' failed: ' + e);
          };
          reader.readAsText(file);
        }, errorCallback);
      }, errorCallback);
    }

    this.readFile = function(filePath, fileContentCallback, errorCallback) {
      window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(directory) {
        readFileInDirectory(directory, filePath, fileContentCallback, errorCallback);
      }, errorCallback);
    };

    function writeFileInDirectory(directory, filePath, fileContent, successCallback, errorCallback) {
      directory.getFile(filePath, {
        create: true
      }, function(fileEntry) {
        fileEntry.createWriter(function(fileWriter) {
          fileWriter.onwriteend = function() {
            if (typeof successCallback === 'function') {
              successCallback();
            }
            console.log('Writing file ' + filePath + ' completed.');
          };
          fileWriter.onerror = function(e) {
            if (typeof errorCallback === 'function') {
              errorCallback(e);
            }
            console.error('Writing file ' + filePath + ' failed: ' + e);
          };
          var fileBlob;
          try {
            fileBlob = new Blob([fileContent], {
              type: 'text/plain'
            });
          } catch (e) {
            // android 4.1
            var bb = new window.WebKitBlobBuilder();
            bb.append(fileContent);
            fileBlob = bb.getBlob('text/plain');
          }
          fileWriter.write(fileBlob);
        }, function(error) {
          console.error(error);
        });
      }, function(error) {
        console.error(error);
      });
    }

    this.writeFile = function(filePath, fileContent, successCallback, errorCallback) {
      window.resolveLocalFileSystemURL(cordova.file.dataDirectory, function(directory) {
        writeFileInDirectory(directory, filePath, fileContent, successCallback, errorCallback);
      }, errorCallback);
    };
  }

  function FileUtilNodeWebkit() {

    var fs = require('fs');
    var dataDirectory = require('nw.gui').App.dataPath;

    this.readFile = function(filePath, fileContentCallback, errorCallback) {
      fs.readFile(dataDirectory + '/' + filePath, function(error, data) {
        if (error) {
          if (typeof errorCallback === 'function') {
            errorCallback(error);
          }
        } else {
          fileContentCallback(data);
        }
      });
    };

    this.writeFile = function(filePath, fileContent, successCallback) {
      fs.writeFile(dataDirectory + '/' + filePath, fileContent, function(error) {
        if (error) {
          if (typeof errorCallback === 'function') {
            errorCallback(error);
          }
          console.error('Writing file ' + filePath + ' failed.');
        } else {
          if (typeof successCallback === 'function') {
            successCallback();
          }
          console.log('Writing file ' + filePath + ' completed.');
        }
      });
    };
  }

  window.dica = window.dica || {};
  if (typeof cordova !== 'undefined' && null !== cordova) {
    window.dica.fileUtil = new FileUtilCordova();
  } else if (typeof require !== 'undefined' && require('nw.gui') && require('fs')) {
    window.dica.fileUtil = new FileUtilNodeWebkit();
  } else {
    throw new Error('No supported platform found. Only cordova and node-webkit are supported.');
  }
})(window);

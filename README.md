fileutil
========

Simple cross platform (cordova, node-webkit) file read and write API.
The root directory for files under cordova is ```cordova.file.dataDirectory``` and under node-webkit it is ```require('nw.gui').App.dataPath```.

The cordova implementation depends on the plugin ```org.apache.cordova.file```.

API
===

```window.dica.fileUtil.writeFile(filePath, fileContent, successCallback, errorCallback)```

filePath ... path to file as String
fileContent ... content of file as String
successCallback ... callback on successfull write as function without any parameter
errorCallback ... callback on error during write as function with the error as parameter


```window.dica.fileUtil.readFile(filePath, successCallback, errorCallback)```

filePath ... path to file as String
successCallback ... callback on successfull write as function with the file content as parameter
errorCallback ... callback on error during write as function with the error as parameter

Install
=====

```bower install https://github.com/Dica-Developer/fileutil.git``` or
```bower install dica-developer-fileutil```

Usage
=====

On including the file lib_fileutil.js ann object fileutil will be added to the global window object.
The file util functions can be found under ```window.dica.fileUtil```.

To write a file use the following method:

```window.dica.fileUtil.writeFile('readme.txt', 'This is the new file content.', function() {
  console.log('File successfuly written.');
}, function (error) {
  console.error('Error on writing file', error);
})```

To read a file use the following method:

```window.dica.fileUtil.readFile(filePath, function(fileContent) {
  console.log('The file content is: ', fileContent);
}, function (error) {
  console.error('Error on reading file', error);
}))```

/* eslint no-unused-vars: 0 */
/* global importScripts, ServiceWorkerWare */
importScripts('ServiceWorkerWare.js');
var root = (function() {
  var tokens = (self.location + '').split('/');
  tokens[tokens.length - 1] = '';
  return tokens.join('/');
})();



var worker = new ServiceWorkerWare();


worker.get('categories', function(req, res) {
      return new Response(JSON.stringify([]));
});


worker.init();
'use strict';

/* Services Hard Coded Vars */
var IHavidmooseSearch = 'http://us.api.invisiblehand.co.uk/v1/products?query=apple+iphone&app_id=a7f34040&app_key=dbd263deb0d84f88300c88199ff3a7d3';
/* Services */

var phonecatServices = angular.module('phonecatServices', ['ngResource']);

phonecatServices.factory('Phone', ['$resource',
  function($resource){
    return $resource('phones/:phoneId.json', {}, {
      query: {method:'GET', params:{phoneId:'phones'}, isArray:true}
    });
}]);

phonecatServices.factory('IH', ['$resource',
	function($resource){
		return $resource(IHavidmooseSearch, {}, {
			query: {method:'GET', isArray:false}
		});
	}
]);

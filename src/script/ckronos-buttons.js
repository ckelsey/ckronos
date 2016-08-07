(function(ckronos){
	ckronos.directive('ckronosButtons', function() {
		return {
			restrict: 'E',
			scope: {
				cancel: '=?',
				update: '=?'
			},
			templateUrl: '../html/ckronos-buttons.html',
			link: function(scope, elm){
				elm.on('$destroy', function(){
					scope.$destroy();
				});
			}
		};
	});
})(angular.module('ckronos'));

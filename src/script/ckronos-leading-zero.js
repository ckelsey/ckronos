(function(ckronos){
	ckronos.directive('ckronosLeadingZero', function() {
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, elm, attr, ngModel) {

				function out(input) {
					if(parseInt(input) < 10){
						input = '0' + input;
					}

					return input;
				}

				function into(data) {
					return parseInt(data);
				}

				ngModel.$parsers.push(into);
				ngModel.$formatters.push(out);

				elm.on('$destroy', function(){
					scope.$destroy();
				});
			}
		};
	});
})(angular.module('ckronos'));

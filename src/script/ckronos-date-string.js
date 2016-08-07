(function(ckronos){
	ckronos.directive('ckronosDateString', function(CKronos){
		return {
			restrict: 'A',
			require: 'ngModel',
			link: function(scope, element, attr, ngModel) {
				var errorTargetSelector = attr.target;
				var errorClass = attr.errorClass || 'error';

				function out(input) {
					var d = new Date(input);

					var el = null;

					if(errorTargetSelector){
						el = angular.element(document.querySelectorAll(errorTargetSelector));
					}else{
						el = element;
					}

					if(el && el.length){
						if(!CKronos.validDate(d)){
							el.addClass(errorClass);
						}else{
							el.removeClass(errorClass);
						}
					}

					return d;
				}

				function into(data) {
					var d = new Date(data);
					return d;
				}

				ngModel.$parsers.push(out);
				ngModel.$formatters.push(into);

				scope.$watch(function(){
					return attr.errorClass;
				}, function(n,o){
					if(n !== o){
						errorClass = n;
					}
				});

				scope.$watch(function(){
					return attr.target;
				}, function(n,o){
					if(n !== o){
						errorTargetSelector = n;
					}
				});
			}
		};
	});
})(angular.module('ckronos'));

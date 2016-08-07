(function(ckronos){
	'use strict';

	ckronos.directive('ckronosTime', function(CKronos, $compile, $timeout){
		return {
			restrict: 'A',
			scope: {
				showSeconds: '=?'
			},
			require:'ngModel',
			link: function(scope, elm, attrs, ngModel){
				var model = ngModel.$modelValue;
				var id = attrs.overlay;
				var toggleSelector = attrs.toggler;
				var originalValue = angular.copy(model);
				scope.active = false;

				angular.element(document.getElementById(toggleSelector)).bind('click', function(){
					$timeout(function(){
						scope.active = true;
						angular.element(document.body).addClass('ckronos-blur');
					});
				});

				scope.dateObject = CKronos.parseDate(model);

				function compile(){
					if(document.getElementById(id)){
						document.body.removeChild(document.getElementById(id));
					}

					var template = '<div class="ckronos-date-time-wrapper" ng-class="active? \'active\' : \'\'" id="'+ id +'">' +
					'<div class="ckronos-date-time-inner">' +
					'<ckronos-clock date="dateObject.date" update="updateTime" show-seconds="showSeconds" class="clickable"></ckronos-clock>' +
					'<ckronos-buttons cancel="cancel" update="updateAndClose"></ckronos-buttons>' +
					'</div>' +
					'</div>';

					var content = $compile(template)(scope);
					angular.element(document.body).append(content);
				}

				function updateModel(data){
					ngModel.$setViewValue(data.date);
					return ngModel.$modelValue;
				}

				scope.close = function() {
					$timeout(function(){
						scope.active = false;
						angular.element(document.body).removeClass('ckronos-blur');
					});
				};

				scope.cancel = function() {
					scope.dateObject = CKronos.parseDate(originalValue);
					scope.close();
				};

				scope.updateTime = function(value) {
					scope.dateObject.time = value;
					scope.dateObject = CKronos.update(scope.dateObject);
				};

				scope.updateAndClose = function(){
					updateModel(scope.dateObject);
					scope.close();
				};

				scope.$watch(function(){
					return ngModel.$modelValue;
				}, function(modelValue){
					if(modelValue && CKronos.validDate(modelValue)) {
						model = modelValue;
						originalValue = angular.copy(model);
						scope.dateObject = CKronos.parseDate(model);
						compile();
					}
				});

				elm.on('$destroy', function(){
					scope.$destroy();
				});
			}
		};
	});

})(angular.module('ckronos'));

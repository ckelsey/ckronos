(function(ckronos){
	'use strict';

	ckronos.directive('ckronosDate', function(CKronos, $compile, $timeout){
		return {
			restrict: 'A',
			scope: {
				dateHtml: '=?',
				showTime: '=?'
			},
			require:'ngModel',
			link: function(scope, elm, attrs, ngModel){
				var model = ngModel.$modelValue;
				var id = attrs.overlay;
				var toggleSelector = attrs.toggler;
				var originalValue = angular.copy(model);
				scope.active = false;

				scope.dateObject = CKronos.parseDate(model);

				function hasShowTime(){
					return (scope.showTime && (parseInt(scope.showTime) === 1 || scope.showTime === true || scope.showTime === 'true'));
				}

				function compile(){
					if(document.getElementById(id)){
						angular.element(document.getElementById(id)).remove();
					}

					var template = '<div class="ckronos-date-time-wrapper" ng-class="active? \'active\' : \'\'" id="'+ id +'">' +
					'<div class="ckronos-date-time-inner">' +
					'<ckronos-calendar-navigation date="dateObject.date" set-month="setMonth" set-today="setToday"></ckronos-calendar-navigation>' +
					'<ckronos-calendar update="updateFromEvent" date="dateObject.date" date-html="dateHtml"></ckronos-calendar>';

					if(hasShowTime()){
						template = template + '<div class="ckronos-date-time_time_wrapper">' +
						'<ckronos-clock date="dateObject.date" update="updateTime"></ckronos-clock>' +
						'<ckronos-buttons cancel="cancel" update="updateAndClose"></ckronos-buttons>' +
						'</div>';
					}

					template = template + '</div></div>';

					var content = $compile(template)(scope);
					angular.element(document.body).append(content);
				}

				angular.element(document.getElementById(toggleSelector)).bind('click', function(){
					$timeout(function(){
						scope.active = true;
						angular.element(document.body).addClass('ckronos-blur');
						compile();
					});
				});

				function updateModel(data){
					ngModel.$setViewValue(data.date);
					return ngModel.$modelValue;
				}

				scope.updateDateObject = function(){
					scope.dateObject = CKronos.update(scope.dateObject);
				};

				scope.close = function() {
					scope.active = false;
					angular.element(document.body).removeClass('ckronos-blur');
					if(document.getElementById(id)){
						angular.element(document.getElementById(id)).remove();
					}
				};

				scope.cancel = function() {
					scope.dateObject = CKronos.parseDate(originalValue);
					scope.close();
				};

				scope.updateAndClose = function(){
					updateModel(scope.dateObject);
					scope.close();
				};

				scope.updateFromEvent = function(e, s) {
					scope.dateObject = CKronos.setEventData(e, scope.dateObject);

					if(!hasShowTime()){
						scope.close();
						return updateModel(scope.dateObject);
					}
				};

				scope.updateTime = function(value) {
					scope.dateObject.time = value;
					scope.dateObject = CKronos.update(scope.dateObject);
				};

				scope.setMonth = function(amount) {
					if(scope.dateObject.data[scope.dateObject.month + amount]){
						scope.dateObject.month = scope.dateObject.month + amount;
					}else{
						scope.dateObject.year = scope.dateObject.year + amount;
						if(scope.dateObject.data.length > scope.dateObject.month + amount){
							scope.dateObject.month = scope.dateObject.data.length - 1;
						}else{
							scope.dateObject.month = 0;
						}
					}

					if(scope.dateObject.day > scope.dateObject.data[scope.dateObject.month].days){
						scope.dateObject.day = scope.dateObject.data[scope.dateObject.month].days;
					}

					return scope.updateDateObject();
				};

				scope.setToday = function() {
					scope.dateObject = CKronos.parseDate(new Date());

					if(!hasShowTime()){
						scope.close();
					}

					return scope.updateDateObject();
				};

				scope.$watch(function(){
					return ngModel.$modelValue;
				}, function(modelValue){
					if(modelValue && CKronos.validDate(modelValue)) {
						model = modelValue;
						originalValue = angular.copy(model);
						scope.dateObject = CKronos.parseDate(model);
					}
				});

				elm.on('$destroy', function(){
					scope.$destroy();
				});
			}
		};
	});

})(angular.module('ckronos'));

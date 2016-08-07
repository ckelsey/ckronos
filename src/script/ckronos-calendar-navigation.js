(function(ckronos){
	'use strict';

	ckronos.directive('ckronosCalendarNavigation', function(CKronos){
		return {
			restrict: 'E',
			scope: {
				date: '=',
				setMonth: '=',
				setToday: '='
			},
			templateUrl: '../html/ckronos-calendar-navigation.html',
			link: function(scope, elm){

				if(!scope.date){
					scope.dateObject = CKronos.parseDate();
				}else{
					scope.dateObject = CKronos.parseDate(scope.date);
				}

				var watchDate = scope.$watch(function(){
					return scope.date;
				}, function(newVal, oldVal){
					if(newVal !== oldVal){
						scope.dateObject = CKronos.parseDate(new Date(newVal));
					}
				});

				scope.$on('$destroy', function() {
					watchDate();
				});

				elm.on('$destroy', function(){
					scope.$destroy();
				});
			}
		};
	});


})(angular.module('ckronos'));

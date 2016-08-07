(function(ckronos){
	'use strict';

	ckronos.directive('ckronosCalendar', function(CKronos, $compile, $timeout){
		return {
			restrict: 'E',
			scope: {
				update: '=?',
				dateHtml: '=?',
				date: '=?'
			},
			templateUrl: '../html/ckronos-calendar.html',
			controller: function($scope){

				if(!$scope.date){
					$scope.dateObject = CKronos.parseDate();
				}else{
					$scope.dateObject = CKronos.parseDate($scope.date);
				}

				var self = this;

				function compile(){
					self.calendar = {
						rows:[]
					};

					if(!isNaN($scope.dateObject.day) && !isNaN($scope.dateObject.month) && !isNaN($scope.dateObject.year)){
						var cell = null;
						var first_day = new Date($scope.dateObject.year, $scope.dateObject.month, 1).getDay();
						var days = [];

						for(var i=1; i<$scope.dateObject.data[$scope.dateObject.month].days+1; i=i+1){
							cell = {
								day: i,
								month: $scope.dateObject.month,
								year: $scope.dateObject.year,
								active: false,
								differentMonth: false
							};

							days.push(cell);
						}

						if(first_day > 0){
							var previousMonth = ($scope.dateObject.month === 0)? CKronos.monthsInYear($scope.dateObject.year-1)[11] : $scope.dateObject.data[$scope.dateObject.month-1];
							var previousYear = ($scope.dateObject.month === 0)? $scope.dateObject.year - 1 : $scope.dateObject.year;
							for(var j=0; j<first_day; j=j+1){
								cell = {
									day: previousMonth.days - j,
									month: previousMonth.index,
									year: previousYear,
									active: false,
									differentMonth: true
								};

								days.unshift(cell);
							}
						}

						var weeks = Math.ceil(days.length / 7);
						var total_cells = weeks * 7;
						var cells_to_add = total_cells - days.length;
						for(var c=1; c<=cells_to_add; c=c+1){
							var newMonth = ($scope.dateObject.month === 11)? CKronos.monthsInYear($scope.dateObject.year+1)[0] : $scope.dateObject.data[$scope.dateObject.month+1];
							var newYear = ($scope.dateObject.month === 11)? $scope.dateObject.year+1 : $scope.dateObject.year;
							cell = {
								day: c,
								month: newMonth.index,
								year: newYear,
								active: false,
								differentMonth: true
							};

							days.push(cell);
						}

						var cell_counter = 0;
						for(var v=0; v<days.length; v=v+1){
							if(cell_counter === 0){
								self.calendar.rows.push([]);
							}

							if(days[v].day === $scope.dateObject.day && days[v].month === $scope.dateObject.month && days[v].year === $scope.dateObject.year){
								days[v].active = true;
							}

							var tempYear = days[v].year;
							var tempMonth = days[v].month;
							var tempDay = days[v].day;

							if(
								$scope.hasOwnProperty('dateHtml') && $scope.dateHtml &&
								$scope.dateHtml.hasOwnProperty(tempYear) && $scope.dateHtml[tempYear] &&
								$scope.dateHtml[tempYear].hasOwnProperty(tempMonth) && $scope.dateHtml[tempYear][tempMonth] &&
								$scope.dateHtml[tempYear][tempMonth].hasOwnProperty(tempDay) && $scope.dateHtml[tempYear][tempMonth][tempDay]
							){
								days[v].html = $scope.dateHtml[tempYear][tempMonth][tempDay];
							}

							self.calendar.rows[self.calendar.rows.length - 1].push(days[v]);

							if(cell_counter === 6){
								cell_counter = 0;
							}else{
								cell_counter++;
							}
						}
					}
				}

				compile();

				var watchDate = $scope.$watch(function(){
					return $scope.date;
				}, function(newVal, oldVal){
					if(newVal !== oldVal){
						if(CKronos.validDate(new Date(newVal)) && CKronos.parseDate(new Date(newVal)) !== $scope.dateObject.date){
							$scope.dateObject = CKronos.parseDate(new Date(newVal));
							compile();
						}
					}
				});

				var watchDateObject = $scope.$watchCollection(function(){
					return $scope.dateObject;
				}, function(newVal, oldVal){
					compile();
				});

				var watchDateHtml = $scope.$watch(function(){
					return $scope.dateHtml;
				}, function(newVal, oldVal){
					compile();
				});

				$scope.$on('$destroy', function() {
					watchDate();
					watchDateHtml();
					watchDateObject();
				});
			},
			controllerAs: 'ctlr',

			link: function(scope, elm){
				elm.on('$destroy', function(){
					scope.$destroy();
				});
			}
		};
	});

})(angular.module('ckronos'));

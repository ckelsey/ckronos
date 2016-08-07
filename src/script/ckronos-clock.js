(function(ckronos){
	'use strict';

	ckronos.directive('ckronosClock', function(CKronos, $timeout, $window){
		return {
			restrict: 'E',
			scope: {
				update: '=?',
				showSeconds: '=?',
				continuous: '=?',
				analog: '=?',
				date: '=?'
			},
			controller: function($scope){},
			controllerAs: 'ctlr',
			templateUrl: '../html/ckronos-clock.html',
			link: function($scope, elm){

				// requestAnimationFrame polyfill, modified from https://gist.github.com/paulirish/1579671
				var animate = $window.requestAnimationFrame || $window.msRequestAnimationFrame || $window.mozRequestAnimationFrame || $window.webkitRequestAnimationFrame || $window.oRequestAnimationFrame;
				var lastTime = 0;
				if (!animate){
					animate = function(callback) {
						var currTime = new Date().getTime();
						var timeToCall = Math.max(0, 16 - (currTime - lastTime));
						$window.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
						lastTime = currTime + timeToCall;
					};
				}

				if(!$scope.dateObject){
					if(!$scope.date){
						$scope.dateObject = CKronos.parseDate();
					}else{
						$scope.dateObject = CKronos.parseDate($scope.date);
					}
				}

				$scope.showAnalog = 0;
				$scope.hourDegrees = 30;
				$scope.minuteDegrees = -30;
				$scope.secondDegrees = 0;

				$scope.getTicks = function(){
					return new Array(60);
				};

				$scope.updateAnalog = function(e){
					if($scope.showAnalog && ($scope.continuous === undefined || (parseInt($scope.continuous) !== 1 && $scope.continuous !== 'true' && $scope.continuous !== true)) && e){

						var element = elm[0].querySelector('.ckronos_clock_type_analog-inner');

						if(element){
							var rect = element.getBoundingClientRect();
							var radius = rect.width / 2;
							var left = rect.left;
							var top = rect.top;

							/* Clock center points */
							var cx = radius + left;
							var cy = radius + top;

							/* Mouse position distance from clock center */
							var dx = e.clientX - cx;
							var dy = e.clientY - cy;

							/* degrees */
							var angle = Math.atan2(dy, dx) * (180 / Math.PI);
							var degrees = angle + 90 - 180;
							if(degrees < 0){
								degrees = degrees + 360;
							}

							degrees = (Math.round(degrees) > -1 || Math.round(degrees) < 360)? Math.round(degrees) : 0 ;
							var percent = (degrees / 360);
							percent = (percent < 0.5) ? percent + 0.5 : percent - 0.5;

							var hour = 12 * percent;
							var minute = (hour - Math.floor(hour)) * 60;

							$scope.dateObject.time.hour = Math.floor(hour);
							$scope.dateObject.time.minute = Math.floor(minute);
							$scope.dateObject.time.second = 0;

							if($scope.update){
								$scope.update($scope.dateObject.time);
							}
						}
					}

					$timeout(function(){
						$scope.hourDegrees = (($scope.dateObject.time.hour + ($scope.dateObject.time.minute / 60)) / 12) * 360;
						$scope.minuteDegrees = (($scope.dateObject.time.minute + ($scope.dateObject.time.second / 60)) / 60) * 360;
						$scope.secondDegrees = ($scope.dateObject.time.second / 60) * 360;
					});
				};

				function analogDragEnd(e){
					document.body.removeEventListener('mousemove', $scope.updateAnalog, false);
					document.body.removeEventListener('mouseup', analogDragEnd, false);
					$scope.updateAnalog(e);
				}

				function continuousUpdate(){
					if($scope.continuous !== undefined && ($scope.continuous === true || $scope.continuous === 'true' || parseInt($scope.continuous) === 1)){
						$timeout(function(){
							$scope.dateObject = CKronos.parseDate();
							$scope.updateAnalog();
						});
					}

					animate(continuousUpdate);
				}

				function updateAnalogFlag(val){
					if(val === undefined || parseInt(val) === 0 || val === 'false' || val === false){
						$scope.showAnalog = 0;
					}else{
						$scope.showAnalog = 1;
					}

					$scope.updateAnalog();
				}

				function updateShowSecondsFlag(val){
					if(val !== undefined && (val === 'false' || val === false || val === '0' || val === 0)){
						$scope.showSecondsDisplay = false;
					}else{
						$scope.showSecondsDisplay = true;
					}
				}

				$scope.analogDragStart = function(e){
					$scope.updateAnalog(e);

					document.body.addEventListener('mousemove', $scope.updateAnalog, false);
					document.body.addEventListener('mouseup', analogDragEnd, false);
				};

				$scope.validate = function(type, value){
					if($scope.update){
						if(type === 'ampm'){
							return $scope.update($scope.dateObject.time);
						}else if(!isNaN(value) && parseInt(value) > -1){
							if(type === 'hour' && parseInt(value) === 0){
								return false;
							}

							return $scope.update($scope.dateObject.time);
						}
					}

					return false;
				};

				continuousUpdate();
				updateAnalogFlag($scope.analog);
				updateShowSecondsFlag($scope.showSeconds);

				var watchAnalog = $scope.$watch(function(){return $scope.analog;}, function(newVal, oldVal){
					if(newVal !== oldVal){
						updateAnalogFlag(newVal);
					}
				});

				var watchDate = $scope.$watch(function(){
					return $scope.date;
				}, function(newVal, oldVal){
					if(newVal !== oldVal){
						if(CKronos.validDate(new Date(newVal))){
							$scope.dateObject = CKronos.parseDate(new Date(newVal));
							$scope.updateAnalog();
						}
					}
				});

				var watchShowSeconds = $scope.$watch(function(){
					return $scope.showSeconds;
				}, function(newVal, oldVal){
					if(newVal !== oldVal){
						updateShowSecondsFlag(newVal);
					}
				});

				$scope.$on('$destroy', function() {
					watchDate();
					watchAnalog();
					watchShowSeconds();
				});

				elm.on('$destroy', function(){
					$scope.$destroy();
				});
			}
		};
	});

})(angular.module('ckronos'));

(function(demo){
	'use strict';
	demo.config(function ($routeProvider, $locationProvider) {
		$routeProvider
		.when('/', {
			templateUrl: "./demo/demo.html",
			controller: 'AppCtlr',
		})
		.when('/readme', {
			templateUrl: "./demo/readme.html",
			controller: 'AppCtlr',
		})
		.otherwise({ redirectTo: '/' });
		$locationProvider.html5Mode(true);
	});

	demo.controller('AppCtlr', function($scope, CKronos){
		var self = this;
		this.CKronos = CKronos;

		var now = new Date();

		this.debug = function(thing){
			console.log(thing);
		};


		this.updateDateString = function(obj){
			var temp = CKronos.update(obj);
			return temp.date;
		};

		this.calendarDemoDate = CKronos.parseDate(now);

		this.calendarDemoHtml = {};
		this.calendarDemoHtml[now.getFullYear()] = {};
		this.calendarDemoHtml[now.getFullYear()][now.getMonth()] = {};
		this.calendarDemoHtml[now.getFullYear()][now.getMonth()][now.getDate()] = '<p>Hey, it\'s today!</p>';

		this.dateDemoHtml = angular.copy(this.calendarDemoHtml);

		this.timeDemoDate = CKronos.parseDate(now);

		this.clickButtonOptions = [{
			name: 'None',
			fn: undefined
		},{
			name: 'Log console message',
			fn: function(){
				console.log('Button clicked')
			}
		}];

		this.clickCalendarOptions = [{
			name: 'None',
			fn: undefined
		},{
			name: 'Update model',
			fn: function(e){
				var temp = CKronos.setEventData(e,CKronos.parseDate());
				self.documentation.ckronosCalendar.properties.scope.date.value = temp.date;
			}
		},{
			name:'Alert date',
			fn: function(e){
				var temp = CKronos.setEventData(e,CKronos.parseDate());
				alert(temp.date);
			}
		}];

		this.clickTimeOptions = [{
			name: 'None',
			fn: undefined
		},{
			name: 'Update model',
			fn: function(e){
				var temp = CKronos.parseDate(self.documentation.ckronosClock.properties.scope.date.value);
				temp.time = e;
				temp = CKronos.update(temp);
				self.documentation.ckronosClock.properties.scope.date.value = temp.date;
			}
		},{
			name:'Alert date',
			fn: function(time){
				var temp = CKronos.parseDate();
				temp.time = time;
				temp = CKronos.update(temp);
				alert(temp.date);
			}
		}];

		this.clickNavOptions = [{
			name: 'None',
			fn: undefined
		},{
			name: 'Update model',
			fn: function(arg){
				var temp = null;

				if(arg === undefined){
					temp = CKronos.parseDate();
				}else{
					temp = CKronos.parseDate(self.documentation.ckronosCalendarNavigation.properties.scope.date.value);
					temp.month = temp.month + arg;
					temp = CKronos.update(temp);
				}

				self.documentation.ckronosCalendarNavigation.properties.scope.date.value = temp.date;
			}
		}];

		this.updateChange = function(dir, propName){
			if(dir.meta.properties.scope[propName].optionModel == null){
				dir.meta.properties.scope[propName].optionModel = dir.meta.properties.scope[propName].defaultOption;
			}

			var optionModel = dir.meta.properties.scope[propName].optionModel;
			dir.meta.properties.scope[propName].value = dir.meta.properties.scope[propName].options[optionModel].fn;
		};

		this.documentation = {
			title: 'CKronos',
			description: 'Angular date/time picker and helpers',

			ckronosButtons: {
				description: 'Renders buttons to control a date or time overlay',
				markup: '<ckronos-buttons cancel="" update=""></ckronos-buttons>',
				properties: {
					scope: {
						"cancel": {
							type: 'function',
							description: "Defining this shows a cancel button, which when clicked calls this function",
							options: self.clickButtonOptions,
							value: null,
							defaultOption: "1",
							change: function(dir){ self.updateChange(dir, 'cancel'); }
						},
						"update": {
							type: 'function',
							description: "Defining this shows an update button, which when clicked calls this function",
							options: self.clickButtonOptions,
							value: null,
							defaultOption: "1",
							change: function(dir){ self.updateChange(dir, 'update'); }
						},
					}
				}
			},

			ckronosCalendar:{
				description: 'Renders a calendar for the given date',
				markup: '<ckronos-calendar date="" date-html="" update=""></ckronos-calendar>',
				postMarkup: '<div style="margin: 21px 0px;"><p><b>Currently displaying:</b>&nbsp;<i ng-bind="directive.meta.properties.scope.date.value"></i></p></div>',
				properties: {
					scope: {
						date: {
							type: 'date',
							description: 'A date string. If the string creates an invalid date, it will default to the current date',
							value: this.calendarDemoDate.date
						},
						update: {
							type: 'function',
							description: "A function to be called when a day is clicked on the calendar. This also is what determines the calender's CSS hover effects",
							options: this.clickCalendarOptions,
							value: null,
							defaultOption: "0",
							change: function(dir){ self.updateChange(dir, 'update'); }
						},
						"date-html": {
							type: 'object',
							description: "An object that contains html strings that can be inserted into a day. Structure goes year -> month -> day",
							value: this.calendarDemoHtml
						}
					}
				}
			},

			ckronosCalendarNavigation: {
				description: 'Renders a calendar navigation element',
				markup: '<ckronos-calendar-navigation date="" set-month="" set-today=""></ckronos-calendar-navigation>',
				properties: {
					scope: {
						date: {
							type: 'date',
							description: 'A date string. If the string creates an invalid date, it will default to the current date',
							value: this.calendarDemoDate.date
						},
						"set-month": {
							type: 'function',
							description: "Defining this shows previous and next buttons, which when clicked calls this function",
							options: self.clickNavOptions,
							value: null,
							defaultOption: "1",
							change: function(dir){ self.updateChange(dir, 'set-month'); }
						},
						"set-today": {
							type: 'function',
							description: "Defining this shows a today button, which when clicked calls this function",
							options: self.clickNavOptions,
							value: null,
							defaultOption: "1",
							change: function(dir){ self.updateChange(dir, 'set-today'); }
						},
					}
				}
			},

			ckronosClock:{
				description: 'Renders a clock for the given date',
				markup: '<ckronos-clock date="" show-seconds="" continuous="" analog="" update="" cancel=""></ckronos-clock>',
				preMarkup: '<div style="width: 100%; max-width: 400px;">',
				postMarkup: '</div>',
				properties: {
					scope: {
						date: {
							type: 'date',
							description: 'A date string. If the string creates an invalid date, it will default to the current date',
							value: this.timeDemoDate.date
						},
						"show-seconds": {
							type: 'boolean',
							description: "Boolean that determines if seconds are to be displayed",
							value: true
						},
						"continuous": {
							type: 'boolean',
							description: "Boolean that determines if the clock is continuously updated with the current time. If set to false and analog is set to true, the time can be updated by clicking or dragging on the clock",
							value: true
						},
						"analog": {
							type: 'boolean',
							description: "Boolean that determines if the clock is displayed as a clock face or input fields",
							value: false
						},
						"update": {
							type: 'function',
							description: "When the time data is changed, this function will be called",
							options: self.clickTimeOptions,
							value: null,
							defaultOption: "1",
							change: function(dir){ self.updateChange(dir, 'update'); }
						}
					}
				}
			},

			ckronosDate: {
				description: 'An element with a date ng-model that when clicked, opens a ckronos-date overlay',
				markup: '<input type="hidden" ckronos-date overlay="" toggler="" ng-model="" date-html="" show-time="" />',
				preMarkup: '<div id="demo-date-picker-toggler" class="date-button" style="width: 210px;">',
				postMarkup: '<span ng-bind="app.CKronos.displayDate(directive.meta.properties.scope[\'ng-model\'].value, \'$mon$ $d$, $yyyy$\') + \' - \' + app.CKronos.displayTime(directive.meta.properties.scope[\'ng-model\'].value, \'$hh$:$mm$ $ampm$\')"></span><i class="fa fa-calendar"></i></div>',
				properties: {
					scope: {
						'ng-model': {
							type: 'date',
							description: 'A date string to bind to',
							value: now
						},
						"date-html": {
							type: 'object',
							description: "An object that contains html strings that can be inserted into a day. Structure goes year->month-day",
							value: this.dateDemoHtml
						},
						'show-time': {
							type: 'boolean',
							description: 'Determines if time settings are to be displayed',
							value: true
						}
					},
					attributes: {
						overlay: {
							type: 'string',
							description: 'The id to give the overlay',
							value: 'demo-date-picker'
						},
						toggler: {
							type: 'string',
							description: 'The id of the element that toggles the overlay',
							value: 'demo-date-picker-toggler'
						}
					}
				}
			},

			ckronosDateString: {
				description: 'Validates a input model\'s date string',
				markup: '<input type="text" ng-model="" ckronos-date-string target="" error-class="" />',
				preMarkup: '<div style="width:140px;">',
				postMarkup: '</div>',
				properties: {
					scope: {
						'ng-model': {
							type: 'string',
							description: 'A date string to bind to.',
							value: now
						}
					},
					attributes: {
						target: {
							type: 'string',
							description: 'A CSS selector that will get a class update if an invalid date is entered. Defaults to the directive',
							value: '[ckronos-date-string]'
						},
						'error-class': {
							type: 'string',
							description: 'A class to add to the target if an invalid date is entered. Defaults to "error"',
							value: 'error'
						}
					}
				}
			},

			ckronosLeadingZero: {
				description: 'Modifies the $parsers and $formatters on ngModel to display numbers less than 10 to have a leading zero',
				markup: '<input type="text" ckronos-leading-zero ng-model="" />',
				preMarkup: '<div style="width:140px;">',
				postMarkup: '</div>',
				properties: {
					scope: {
						'ng-model': {
							type: 'string',
							description: 'A string or number to bind to. Note: this only adds the leading zeros on initial display. Editing an input renders what was entered. This directive expects that the value will be some kind of number as parseInt() is used in the $formatter',
							value: 1
						}
					}
				}
			},

			ckronosTime: {
				description: 'An element with a date ng-model that when clicked, opens a ckronos-clock overlay',
				markup: '<input type="hidden" ckronos-time overlay="" toggler="" ng-model="" show-seconds="" />',
				preMarkup: '<div id="demo-time-picker-toggler" class="date-button" style="width:140px;">',
				postMarkup: '<span ng-bind="app.CKronos.displayTime(directive.meta.properties.scope[\'ng-model\'].value)"></span><i class="fa fa-clock-o"></i></div>',
				properties: {
					scope: {
						'ng-model': {
							type: 'date',
							description: 'A date string to bind to',
							value: now
						},
						'show-seconds': {
							type: 'boolean',
							description: 'Determines if seconds are to be displayed',
							value: true
						}
					},
					attributes: {
						overlay: {
							type: 'string',
							description: 'The id to give the overlay',
							value: 'demo-time-picker'
						},
						toggler: {
							type: 'string',
							description: 'The id of the element that toggles the overlay',
							value: 'demo-time-picker-toggler'
						}
					}
				}
			},

			CKronos: {
				description: 'Service with helper methods related to dates and time',
				properties: {
					daysInMonth: {
						description: 'Gets the days in the given month and year',
						arguments: {
							month: {
								type: 'number',
								description: '0 based index of the month'
							},
							year: {
								type: 'number',
								description: 'year'
							}
						},
						returns: {
							type: 'number',
							description: 'How many days'
						}
					},
					displayDate: {
						description: 'Formats a date object into a string',
						arguments: {
							date:{
								type: 'date',
								description: 'A date object. Defaults to the current date'
							},
							format: {
								type: 'string',
								description: 'How to format the date.' +
								'<br /><strong>$month$ </strong> <i>full month name</i>'+
								'<br /><strong>$mon$ </strong> <i>shortened month name</i>'+
								'<br /><strong>$mm$ </strong> <i>month number with leading zeros</i>'+
								'<br /><strong>$m$ </strong> <i>month number</i>'+
								'<br /><strong>$day$ </strong> <i>full day name</i>'+
								'<br /><strong>$da$ </strong> <i>shortened day name</i>'+
								'<br /><strong>$dd$ </strong> <i>day number with leading zeros</i>'+
								'<br /><strong>$d$ </strong> <i>day number</i>'+
								'<br /><strong>$yyyy$ </strong> <i>full year</i>'+
								'<br /><strong>$yy$ </strong> <i>last 2 digits of the year</i>'
							}
						},
						returns: {
							type: 'string',
							description: 'Formatted string'
						}
					},
					displayTime: {
						description: 'Formats a date object into a time string',
						arguments: {
							date:{
								type: 'date',
								description: 'A date object. Defaults to the current date'
							},
							format: {
								type: 'string',
								description: 'How to format the date.' +
								'<br /><strong>$HH$ </strong> <i>military hour with leading zeros</i>'+
								'<br /><strong>$H$ </strong> <i>military hour</i>'+
								'<br /><strong>$hh$ </strong> <i>hour with leading zeros</i>'+
								'<br /><strong>$h$ </strong> <i>hour</i>'+
								'<br /><strong>$mm$ </strong> <i>minute with leading zeros</i>'+
								'<br /><strong>$m$ </strong> <i>minute</i>'+
								'<br /><strong>$ss$ </strong> <i>second with leading zeros</i>'+
								'<br /><strong>$s$ </strong> <i>second</i>'+
								'<br /><strong>$AMPM$ </strong> <i>capitalized period of day</i>'+
								'<br /><strong>$ampm$ </strong> <i>period of day</i>'
							}
						},
						returns: {
							type: 'string',
							description: 'Formatted string'
						}
					},
					monthsInYear: {
						description: 'Gathers data on the months in a given year',
						arguments: {
							year: {
								type: 'number',
								description: 'the year to calculate'
							}
						},
						returns: {
							type: 'array',
							description: 'array object for every month in the given year <pre>' + JSON.stringify([
								{
									'longname': 'string',
									'shortname': 'string',
									'days(in month)': 'number',
									'index': 'number'
								}
							], null, "  ") + '</pre>'
						}
					},
					parseDate: {
						description: 'Parses a date',
						arguments: {
							date:{
								type: 'date',
								description: 'A date object. Defaults to the current date'
							},
						},
						returns: {
							type: 'object',
							description: '<pre>' + JSON.stringify({
								date: 'date',
								year: 'number',
								month: 'number(0 based)',
								day: 'number',
								time: {
									hour: 'number',
									Hour: 'number(military)',
									minute: 'number',
									second: 'number',
									ampm: 'string'
								},
								"data(array object for every month in the given year)": [
									{
										'longname': 'string',
										'shortname': 'string',
										'days(in month)': 'number',
										'index': 'number'
									}
								]
							}, null, "  ") + '</pre>'
						}
					},
					parseTime: {
						description: 'Parses the time of a date',
						arguments: {
							date:{
								type: 'date',
								description: 'A date object. Defaults to the current date'
							},
						},
						returns: {
							type: 'object',
							description: '<pre>' + JSON.stringify({
								hour: 'number',
								Hour: 'number(military)',
								minute: 'number',
								second: 'number',
								ampm: 'string'
							}, null, "  ") + '</pre>'
						}
					},
					resetDate: {
						description: 'Creates a new date from an object created by CKronos.parseDate() where some or all of the properties have changed',
						arguments: {
							obj: {
								type: 'object',
								description: 'The object to update, must be an object that was created from CKronos.parseDate()'
							}
						},
						returns: {
							type: 'date',
							description: 'A new date'
						}
					},
					setEventData: {
						description: 'Creates a new date object where an event target has any attributes of ampm, hour, minute, second, day, month, or year',
						arguments: {
							event: {
								type: 'event data',
								description: 'The event data, but must have the currentTarget property'
							},
							obj: {
								type: 'object',
								description: 'The object to update, must be an object that was created from CKronos.parseDate()'
							}
						},
						returns: {
							type: 'object',
							description: 'see CKronos.parseDate()'
						}
					},
					update: {
						description: 'Short method for to reset and get a new date object. CKronos.parseDate(CKronos.resetDate(data))',
						arguments: {
							obj: {
								type: 'object',
								description: 'The object to update, must be an object that was created from CKronos.parseDate()'
							}
						},
						returns: {
							type: 'object',
							description: 'see CKronos.parseDate()'
						}
					},
					validDate: {
						description: 'Checks to see if a date object is valid',
						arguments: {
							date:{
								type: 'date',
								description: 'A date object. Defaults to the current date'
							}
						},
						returns: {
							type: 'boolean',
							description: 'If the date is valid or not'
						}
					},
				}
			}
		}
	});
})(angular.module('app', [
	'ngResource',
	'ngSanitize',
	'ngRoute',
	'ckronos'
]));

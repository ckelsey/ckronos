(function(ckronos){
	'use strict';

	ckronos.service('CKronos', function(){
		var self = {
			validDate: function(d){
				if ( Object.prototype.toString.call(d) === "[object Date]" ) {
					if ( isNaN( d.getTime() ) ) {
						return false;
					}else {
						return true;
					}
				}else {
					return false;
				}
			},

			displayTime: function(date, display){
				date = self.validDate(date) ? new Date(date) : new Date();
				var timeObject = self.parseTime(date);
				var values_keys = [
					{
						key: "$HH$",
						value: timeObject.Hour < 10 ? '0' + timeObject.Hour : timeObject.Hour
					},{
						key: "$H$",
						value: timeObject.Hour
					},{
						key: "$hh$",
						value: timeObject.hour < 10 ? '0' + timeObject.hour : timeObject.hour
					},{
						key: "$h$",
						value: timeObject.hour
					},{
						key: "$mm$",
						value: timeObject.minute < 10 ? '0' + timeObject.minute : timeObject.minute
					},{
						key: "$m$",
						value: timeObject.minute
					},{
						key: "$ss$",
						value: timeObject.second < 10 ? '0' + timeObject.second : timeObject.second
					},{
						key: "$s$",
						value: timeObject.second
					},{
						key: "$AMPM$",
						value: timeObject.ampm.toUpperCase()
					},{
						key: "$ampm$",
						value: timeObject.ampm
					}
				];

				var values_keys_length = values_keys.length;

				if(!display){
					display = '$hh$:$mm$:$ss$ $ampm$';
				}

				for(var i = 0; i < values_keys_length; i++){
					if(display.indexOf(values_keys[i].key > -1)){
						display = display.replace(values_keys[i].key, values_keys[i].value);
					}
				}
				return display;
			},

			parseTime: function(date){
				date = self.validDate(date) ? new Date(date) : new Date();
				var h, Hour, ampm, min, sec;

				if(date && !isNaN(date.getHours())){
					h = date.getHours();
					Hour = date.getHours();
					if(Hour > 11){
						ampm = 'pm';
						h = (h > 12)? h - 12 : h;
					}else if(Hour === 0){
						h = 12;
						ampm = 'am';
					}else{
						ampm = 'am';
					}

					min = date.getMinutes();
					sec = date.getSeconds();
				}

				return {
					hour:h,
					Hour: Hour,
					minute: min,
					second: sec,
					ampm: ampm
				};
			},

			displayDate: function(date, display){
				date = self.validDate(date) ? new Date(date) : new Date();
				var dateObject = self.parseDate(date);
				var month_array_short = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
				var month_array_long = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];
				var day_array_short = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
				var day_array_long = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
				var values_keys = [
					{
						key: "$month$",
						value: month_array_long[dateObject.month]
					},{
						key: "$mon$",
						value: month_array_short[dateObject.month]
					},{
						key: "$mm$",
						value: dateObject.month + 1 < 10 ? '0' + dateObject.month + 1 : dateObject.month + 1
					},{
						key: "$m$",
						value: dateObject.month + 1
					},{
						key: "$day$",
						value: day_array_long[date.getDay()]
					},{
						key: "$da$",
						value: day_array_short[date.getDay()]
					},{
						key: "$dd$",
						value: dateObject.day < 10 ? '0' + dateObject.day : dateObject.day
					},{
						key: "$d$",
						value: dateObject.day
					},{
						key: "$yyyy$",
						value: dateObject.year.toString()
					},{
						key: "$yy$",
						value: dateObject.year.toString().substr(2,2)
					},
				];

				var values_keys_length = values_keys.length;

				if(!display){
					display = '$mon$ $d$, $yyyy$';
				}

				for(var i = 0; i < values_keys_length; i++){
					if(display.indexOf(values_keys[i].key > -1)){
						display = display.replace(values_keys[i].key, values_keys[i].value);
					}
				}
				return display;
			},

			parseDate: function(date){
				date = self.validDate(date) ? new Date(date) : new Date();
				var y, m, d, t;

				y = (date && !isNaN(date.getYear()))? date.getYear() + 1900 : null;
				m = (date && !isNaN(date.getMonth()))? date.getMonth(): null;
				d = (date && !isNaN(date.getDay()))? date.getDate(): null;
				t = self.parseTime(date);

				return {
					date: date,
					year: y,
					month: m,
					day: d,
					time: t,
					data: self.monthsInYear(y)
				};
			},

			monthsInYear: function(year){
				year = (!year)? new Date().getYear() + 1900 : year;
				return [
					{ 'longname': 'January', 'shortname': 'Jan', 'days': self.daysInMonth(0,year), 'index':0 },
					{ 'longname': 'February', 'shortname': 'Feb', 'days': self.daysInMonth(1,year), 'index':1 },
					{ 'longname': 'March', 'shortname': 'Mar', 'days': self.daysInMonth(2,year), 'index':2 },
					{ 'longname': 'April', 'shortname': 'Apr', 'days': self.daysInMonth(3,year), 'index':3 },
					{ 'longname': 'May', 'shortname': 'May', 'days': self.daysInMonth(4,year), 'index':4 },
					{ 'longname': 'June', 'shortname': 'Jun', 'days': self.daysInMonth(5,year), 'index':5 },
					{ 'longname': 'July', 'shortname': 'Jul', 'days': self.daysInMonth(6,year), 'index':6 },
					{ 'longname': 'August', 'shortname': 'Aug', 'days': self.daysInMonth(7,year), 'index':7 },
					{ 'longname': 'September', 'shortname': 'Sep', 'days': self.daysInMonth(8,year), 'index':8 },
					{ 'longname': 'October', 'shortname': 'Oct', 'days': self.daysInMonth(9,year), 'index':9 },
					{ 'longname': 'November', 'shortname': 'Nov', 'days': self.daysInMonth(10,year), 'index':10 },
					{ 'longname': 'December', 'shortname': 'Dec', 'days': self.daysInMonth(11,year), 'index':11 }
				];
			},

			daysInMonth: function (mon, year) { // m is 0 indexed: 0-11
				year = (!year)? new Date().getYear() + 1900 : year;
				switch (mon) {
					case 1 :
					return (year % 4 === 0 && year % 100) || year % 400 === 0 ? 29 : 28;
					case 8 : case 3 : case 5 : case 10 :
					return 30;
					default :
					return 31;
				}
			},

			resetDate: function(data){
				var date = new Date();

				date.setHours(data.time.ampm === 'am' ? parseInt(data.time.hour) : parseInt(data.time.hour) + 12);
				date.setMinutes(parseInt(data.time.minute));
				date.setSeconds(parseInt(data.time.second));
				date.setYear(parseInt(data.year));
				date.setDate(parseInt(data.day));
				date.setMonth(parseInt(data.month));

				return date;
			},

			update: function(data){
				return self.parseDate(self.resetDate(data));
			},

			setEventData: function(e, obj){
				if(e){
					e.stopPropagation();

					var _this = e.currentTarget;
					var day = parseInt(_this.getAttribute('day'));
					var month = parseInt(_this.getAttribute('month'));
					var year = parseInt(_this.getAttribute('year'));
					var hour = parseInt(_this.getAttribute('hour'));
					var minute = parseInt(_this.getAttribute('minute'));
					var second = parseInt(_this.getAttribute('second'));
					var ampm = parseInt(_this.getAttribute('ampm'));

					obj.day = !isNaN(day) ? day : obj.day;
					obj.month = !isNaN(month) ? month : obj.month;
					obj.year = !isNaN(year) ? year : obj.year;
					obj.hour = !isNaN(hour) ? hour : obj.hour;
					obj.minute = !isNaN(minute) ? minute : obj.minute;
					obj.second = !isNaN(second) ? second : obj.second;
					obj.ampm = ampm || obj.ampm;
				}

				obj = self.update(obj);

				return obj;
			}
		};

		return self;
	});

})(angular.module('ckronos'));

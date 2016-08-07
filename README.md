# ckronos

Angular date/time picker and helpers

## Install

* * *

`bower install ckronos`

**Add to your app**

`angular.module('app’, ['ckronos])`

[Live demo](http://ckronos.cklsylabs.com/)


# Directives

* * *

## ckronosButtons

Renders buttons to control a date or time overlay

**MARKUP**

```html
<ckronos-buttons cancel="" update=""></ckronos-buttons>
```

**SCOPE**

`cancel` - *function* - Defining this shows a cancel button, which when clicked calls this function

`update` - *function* - Defining this shows an update button, which when clicked calls this function



* * *

## ckronosCalendarNavigation

Renders a calendar navigation element

**MARKUP**

```html
<ckronos-calendar-navigation date="" set-month="" set-today=""></ckronos-calendar-navigation>
```

**SCOPE**

`date` - *date* - A date string. If the string creates an invalid date, it will default to the current date

`set-month` - *function* - Defining this shows previous and next buttons, which when clicked calls this function

`set-today` - *function* - Defining this shows a today button, which when clicked calls this function



* * *

## ckronosCalendar

Renders a calendar for the given date

**MARKUP**

```html
<ckronos-calendar date="" date-html="" update=""></ckronos-calendar>
```

**SCOPE**

`date` - *date* - A date string. If the string creates an invalid date, it will default to the current date

`update` - *function* - A function to be called when a day is clicked on the calendar. This also is what determines the calender's CSS hover effects

`date-html` - *object* - An object that contains html strings that can be inserted into a day. Structure goes year -> month -> day



* * *

## ckronosClock

Renders a clock for the given date

**MARKUP**

```html
<ckronos-clock date="" show-seconds="" continuous="" analog="" update="" cancel=""></ckronos-clock>
```

**SCOPE**

`date` - *date* - A date string. If the string creates an invalid date, it will default to the current date

`show-seconds` - *boolean* - Boolean that determines if seconds are to be displayed

`continuous` - *boolean* - Boolean that determines if the clock is continuously updated with the current time. If set to false and analog is set to true, the time can be updated by clicking or dragging on the clock

`analog` - *boolean* - Boolean that determines if the clock is displayed as a clock face or input fields

`update` - *function* - When the time data is changed, this function will be called



* * *

## ckronosDateString

Validates a input model's date string

**MARKUP**

```html
<input type="text" ng-model="" ckronos-date-string target="" error-class="" />
```

**SCOPE**

`ng-model` - *string* - A date string to bind to.


**ATTRIBUTES**

`target` - *string* - A CSS selector that will get a class update if an invalid date is entered. Defaults to the directive

`error-class` - *string* - A class to add to the target if an invalid date is entered. Defaults to "error"



* * *

## ckronosDate

An element with a date ng-model that when clicked, opens a ckronos-date overlay

**MARKUP**

```html
<input type="hidden" ckronos-date overlay="" toggler="" ng-model="" date-html="" show-time="" />
```

**SCOPE**

`ng-model` - *date* - A date string to bind to

`date-html` - *object* - An object that contains html strings that can be inserted into a day. Structure goes year -> month -> day

`show-time` - *boolean* - Determines if time settings are to be displayed


**ATTRIBUTES**

`overlay` - *string* - The id to give the overlay

`toggler` - *string* - The id of the element that toggles the overlay



* * *

## ckronosLeadingZero

Modifies the $parsers and $formatters on ngModel to display numbers less than 10 to have a leading zero

**MARKUP**

```html
<input type="text" ckronos-leading-zero ng-model="" />
```

**SCOPE**

`ng-model` - *string* - A string or number to bind to. Note: this only adds the leading zeros on initial display. Editing an input renders what was entered. This directive expects that the value will be some kind of number as parseInt() is used in the $formatter



* * *

## ckronosTime

An element with a date ng-model that when clicked, opens a ckronos-clock overlay

**MARKUP**

```html
<input type="hidden" ckronos-time overlay="" toggler="" ng-model="" show-seconds="" />
```

**SCOPE**

`ng-model` - *date* - A date string to bind to

`show-seconds` - *boolean* - Determines if seconds are to be displayed


**ATTRIBUTES**

`overlay` - *string* - The id to give the overlay

`toggler` - *string* - The id of the element that toggles the overlay



* * *



# Services

* * *

## CKronos

Service with helper methods related to dates and time

### daysInMonth

**arguments**

 * `month` - *number*
```html
0 based index of the month
```

 * `year` - *number*
```html
year
```

***returns - number***
```javascript
How many days
```

### displayDate

**arguments**

 * `date` - *date*
```html
A date object. Defaults to the current date
```

 * `format` - *string*
```html
How to format the date.
$month$ full month name
$mon$ shortened month name
$mm$ month number with leading zeros
$m$ month number
$day$ full day name
$da$ shortened day name
$dd$ day number with leading zeros
$d$ day number
$yyyy$ full year
$yy$ last 2 digits of the year
```

***returns - string***
```javascript
Formatted string
```

### displayTime

**arguments**

 * `date` - *date*
```html
A date object. Defaults to the current date
```

 * `format` - *string*
```html
How to format the date.
$HH$ military hour with leading zeros
$H$ military hour
$hh$ hour with leading zeros
$h$ hour
$mm$ minute with leading zeros
$m$ minute
$ss$ second with leading zeros
$s$ second
$AMPM$ capitalized period of day
$ampm$ period of day
```

***returns - string***
```javascript
Formatted string
```

### monthsInYear

**arguments**

 * `year` - *number*
```html
the year to calculate
```

***returns - array***
```javascript
array object for every month in the given year
[
  {
    "longname": "string",
    "shortname": "string",
    "days(in month)": "number",
    "index": "number"
  }
]

```

### parseDate

**arguments**

 * `date` - *date*
```html
A date object. Defaults to the current date
```

***returns - object***
```javascript
{
  "date": "date",
  "year": "number",
  "month": "number(0 based)",
  "day": "number",
  "time": {
    "hour": "number",
    "Hour": "number(military)",
    "minute": "number",
    "second": "number",
    "ampm": "string"
  },
  "data(array object for every month in the given year)": [
    {
      "longname": "string",
      "shortname": "string",
      "days(in month)": "number",
      "index": "number"
    }
  ]
}

```

### parseTime

**arguments**

 * `date` - *date*
```html
A date object. Defaults to the current date
```

***returns - object***
```javascript
{
  "hour": "number",
  "Hour": "number(military)",
  "minute": "number",
  "second": "number",
  "ampm": "string"
}

```

### resetDate

**arguments**

 * `obj` - *object*
```html
The object to update, must be an object that was created from CKronos.parseDate()
```

***returns - date***
```javascript
A new date
```

### setEventData

**arguments**

 * `event` - *event data*
```html
The event data, but must have the currentTarget property
```

 * `obj` - *object*
```html
The object to update, must be an object that was created from CKronos.parseDate()
```

***returns - object***
```javascript
see CKronos.parseDate()
```

### update

**arguments**

 * `obj` - *object*
```html
The object to update, must be an object that was created from CKronos.parseDate()
```

***returns - object***
```javascript
see CKronos.parseDate()
```

### validDate

**arguments**

 * `date` - *date*
```html
A date object. Defaults to the current date
```

***returns - boolean***
```javascript
If the date is valid or not
```


* * *

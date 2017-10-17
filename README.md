# calendar-date-picker
This component provides a view that allows the user to select a single date from a set of available dates. The view contains a list of month calendars, where only months with available dates are displayed.

<img src="https://i.imgur.com/NASNKZ4.png" width="250">


## Props
- **dates** - *Array* of date strings in format 'YYYY-MM-DD'. These are the date selection options
- **onSelectDate** - Callback when date selection is made, returns a *moment* object
- **primaryColor** - Color *string* used for month labels and date options

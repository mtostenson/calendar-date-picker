import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types';
import {
    StyleSheet,
    View,
    ScrollView,
    Text,
    TouchableOpacity,
} from 'react-native';
import moment from 'moment';

const padding7 = 7;

const componentStyles = StyleSheet.create({
    calendar: {
        backgroundColor: 'white',
        marginBottom: padding7,
        marginHorizontal: padding7,
        padding: padding7,
        elevation: 2,
        shadowColor: 'black',
        shadowOpacity: 0.15,
        shadowRadius: 2,
        shadowOffset: {
            height: 1,
            width: 0,
        },
        zIndex: 1,
    },
    date: {
        flex: 1,
        padding: padding7,
        justifyContent: 'center',
        height: 44,
    },
    day: {
        flex: 1,
        color: 'gray',
        textAlign: 'center',
        paddingBottom: padding7,
    },
    month: {
        paddingBottom: padding7,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 24,
    },
    scrollView: {
        paddingTop: padding7,
    },
    flexRow: {
        flexDirection: 'row',
    },
});

export default class CalendarPicker extends Component {

    constructor(props) {
        super(props);
        this.state = { months: this.generateCalendar(props.dates) };
    }

    componentWillReceiveProps({ dates }) {
        this.setState({ months: this.generateCalendar(dates) });
    }

    generateCalendar = (dates = []) => {
        const utcDates = dates.map((date) => moment.utc(date, 'YYYY-MM-DD'));
        const months = [];
        let curDate;
        utcDates.forEach((date) => {
            if (curDate === undefined || date.month() !== curDate.month()) {
                curDate = date;
                const first = moment.utc([curDate.year(), curDate.month()]);
                const month = [];
                const nextDate = first.clone();
                while (nextDate.month() === first.month()) {
                    month.push({
                        selectable: !!utcDates.find((d) => nextDate.isSame(d)),
                        date: nextDate.clone(),
                    });
                    nextDate.add(1, 'day');
                }
                months.push(month);
            }
        });
        return months;
    };

    renderMonth = (month) => {
        if (month.length) {
            const first = month[0].date;
            const firstRow = [];
            for (let x = 0; x < first.day(); x++) {
                firstRow.push({});
            }
            const rows = [];
            let curRow = firstRow;
            for (const date in month) {
                if (curRow.length === 7) {
                    rows.push(curRow);
                    curRow = [month[date]];
                } else {
                    curRow.push(month[date]);
                }
            }
            if (curRow.length) {
                while (curRow.length < 7) {
                    curRow.push({});
                }
                rows.push(curRow);
            }
            const daysOfWeek = [];
            for (var i = 0; i < 7; i++) {
                daysOfWeek.push(moment().isoWeekday(i).toString().substring(0, 2));
            }
            return (
                <View
                    key={first.month()}
                    style={componentStyles.calendar}
                >
                    <Text style={[componentStyles.month, { color: this.props.primaryColor }]}>
                        {moment.months(first.month())}
                    </Text>
                    <View style={componentStyles.flexRow}>
                        {daysOfWeek.map((day, index) => {
                            return (
                                <Text
                                    key={index}
                                    style={componentStyles.day}
                                    textAlign="center"
                                >
                                    {day}
                                </Text>
                            );
                        })}
                    </View>
                    {rows.map((row, i) => {
                        return (
                            <View
                                key={i}
                                style={componentStyles.flexRow}
                            >
                                {row.map((date, j) => {
                                    if (date.date) {
                                        const isSelection = this.props.selection && date.date.isSame(this.props.selection);
                                        const dateStyle = {
                                            color: date.selectable ? date.isSelection ? 'red' : this.props.primaryColor : 'grey',
                                            fontWeight: date.selectable ? 'bold' : 'normal',
                                            textAlign: 'center',
                                        }
                                        return (
                                            <TouchableOpacity
                                                trackAction="calendarPickerDate"
                                                disabled={!date.selectable}
                                                key={j}
                                                style={componentStyles.date}
                                                onPress={() => this.props.onSelectDate(date.date)}
                                            >
                                                <Text style={dateStyle}>
                                                    {date.date.date()}
                                                </Text>
                                            </TouchableOpacity>
                                        );
                                    } else {
                                        return (
                                            <View
                                                key={j}
                                                style={componentStyles.date}
                                            />
                                        );
                                    }
                                })}
                            </View>
                        );
                    })}
                </View>
            );
        }
    };

    render() {
        return (
            <ScrollView style={componentStyles.scrollView}>
                {this.state.months.map(this.renderMonth)}
            </ScrollView>
        );
    }

}

CalendarPicker.propTypes = {
    dates: PropTypes.array.isRequired,
    onSelectDate: PropTypes.func.isRequired,
    selection: PropTypes.object,
    primaryColor: PropTypes.string,
};

CalendarPicker.defaultProps = {
    primaryColor: 'firebrick',
};

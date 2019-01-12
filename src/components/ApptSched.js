import React, { Component } from 'react';
import moment from 'moment';
import Calendar from 'react-calendar';
import PropTypes from 'prop-types';


class ApptSched extends Component {
    constructor(props) {
        const { date } = props;
        super(props);
        this.state = { date, availTimes: [] }; // ES6! Used to be date: date
        this.fetchAvailTimes = this.fetchAvailTimes.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    componentDidMount() {
        this.fetchAvailTimes();
    }

    onChange(date) {
        console.log('new date clicked:', date, 'moment: ', moment(date));
        this.setState({ date: moment(date) }, this.fetchAvailTimes);
        // this.fetchAvailTimes();
    }

    fetchAvailTimes() {
        console.log('ApptSched.fetchAvailTimes: state:', this.state);
        const { date } = this.state;
        const { baseURL } = this.props;
        const url = `${baseURL}/availAppts?year=${date.year()}&month=${date.month()}&date=${date.date()}`;
        console.log('ApptChooser url:', url);
        console.log(url);
        fetch(url)
            .then(response => response.json())
            .then((availTimes) => {
                console.log(availTimes);
                console.log('ApptChooser: returning now...');
                this.setState({ availTimes });
            })
            .catch(error => console.log('failed to get availTimes:', error));
    }

    render() {
        const { baseURL } = this.props;
        const { date, availTimes } = this.state;
        return (
            <div>
                <Calendar
                    onChange={this.onChange}
                    value={date.toDate()}
                />
                <ApptChooser reloadTimes={this.fetchAvailTimes} date={date} availTimes={availTimes} baseURL={baseURL} reserveAppt="/reserveAppt" />
            </div>
        );
    }
}

ApptSched.propTypes = {
    date: PropTypes.instanceOf(moment).isRequired,
    baseURL: PropTypes.string.isRequired,
};

export default ApptSched;
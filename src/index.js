import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Calendar from 'react-calendar';
import moment from 'moment';
import ReactModal from 'react-modal';
import PropTypes from 'prop-types';


class ApptTime extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    const { onItemClick, apptTime } = this.props;
    // this.props.onItemClick(this.props.apptTime);
    onItemClick(apptTime);
  }

  render() {
    const { apptTime } = this.props;
    return (
      <li><button type="button" onClick={this.onClick}>{apptTime}</button></li>
    );
  }
}

ApptTime.propTypes = {
  apptTime: PropTypes.number.isRequired,
  onItemClick: PropTypes.func.isRequired,
};

class ApptChooser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      name: '',
      email: '',
      phone: '',
      comments: '',
      apptType: 'default',
      apptTime: null,
    };

    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleBookAppt = this.handleBookAppt.bind(this);

    this.handleOpenReserveModal = this.handleOpenReserveModal.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
  }

  handleOpenReserveModal(apptTime) {
    console.log('open reserve called with:', apptTime);
    this.setState({ showModal: true, apptTime });
  }

  handleCloseModal() {
    this.setState({ showModal: false });
  }

  handleFormChange(evt) {
    this.setState({ [evt.target.name]: evt.target.value });
  }

  handleBookAppt(event) {
    event.preventDefault();
    this.handleCloseModal();
    const { baseURL, reserveAppt, date, reloadTimes } = this.props;
    const {
      apptTime, apptType, name, email, phone, comments,
    } = this.state;
    const url = encodeURI(`${baseURL + reserveAppt}?year=${date.year()}&month=${date.month()}&date=${date.date()}&hour=${apptTime}&appt_type=${apptType}&email=${email}&phone=${phone}&name=${name}&comments=${comments}`);
    console.log('reserve url:', url);
    fetch(url)
      .then(response => reloadTimes())
      .catch((error) => { console.log(error); });
  }

  render() {
    const { availTimes } = this.props;
    if (availTimes.length === 0) {
      return (
        <span>fetching available appointment times</span>
      );
    }
    const availTimesComponents = 
    availTimes.map(time => <ApptTime onItemClick={this.handleOpenReserveModal} key={time} apptTime={time} />);
    console.log('ApptChooser: times:', availTimesComponents);

    const {
      showModal, name, email, phone, comments,
    } = this.state;
    const { date } = this.props;
    return (
      <div id="ApptChooser">
          Book an appointment for {' '}
        {date.format('MMMM Do YYYY')}
        <ul>
          {availTimesComponents}
        </ul>
        <ReactModal
          appElement={document.getElementById('root')}
          isOpen={showModal}
          contentLabel="Minimal Modal Example"
        >
          <form onSubmit={this.handleBookAppt}>
            <input name="name" onChange={this.handleFormChange} value={name} placeholder="Your name" />
            <input name="email" onChange={this.handleFormChange} value={email} placeholder="Email" />
            <input name="phone" onChange={this.handleFormChange} value={phone} placeholder="Phone" />
            <textarea name="comments" onChange={this.handleFormChange} placeholder="Describe how we can help with your real estate need" value={comments} />
            <br />
            <button type="submit">Reserve now</button>
            <button type="button" onClick={this.handleCloseModal}>Cancel</button>
          </form>
        </ReactModal>
      </div>
    );
  }
}

ApptChooser.propTypes = {
  baseURL: PropTypes.string.isRequired,
  reserveAppt: PropTypes.string.isRequired,
  date: PropTypes.instanceOf(moment).isRequired,
  reloadTimes: PropTypes.func.isRequired,
};

ApptChooser.propTypes = {
  availTimes: PropTypes.arrayOf(PropTypes.number).isRequired,
};

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

let startDate = moment();
if (startDate.hour() > 19) {
  startDate = moment().add(1, 'days');
}
console.log(startDate.toDate());

ReactDOM.render(
  <ApptSched date={startDate} baseURL="//localhost:3001" />,
  document.getElementById('root'),
);
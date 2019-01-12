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
  
  export default ApptTime;
import React, { useEffect, useState } from 'react';
import './Stats.scss';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as projectActions from "../../redux/actions/projectActions";
import * as authActions from "../../redux/actions/authActions";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Loader from '../common/loader';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


function Stats({ selectedProject, stats, actions, ...props }) {
  useEffect(() => {
    actions.projectActions.getStats();
  }, [actions]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggle = () => setDropdownOpen(prevState => !prevState);
  const [timeValue, setTimeValue] = useState('');
  useEffect(() => {
    setTimeValue(stats.data.timeUnit);
  }, [stats]);

  function timeUnit(e) {
    setTimeValue(e.currentTarget.textContent);
  }
  

  return (
    <div className="stats d-flex">
      {stats.isFetching ? <Loader /> : <>
        <div className="statsWidget">
        <h1>{stats.data.activeProducts}</h1>
        <p>Active Products</p>
        <Link to="/project-select">View all</Link>
      </div>
      <div className="statsWidget">
        <h1>{stats.data.totalCredits}</h1>
        <p>Total Credits</p>
        <Link to="/project-select">View all</Link>
      </div>
      <div className="statsWidget">
        <h1>{stats.data.totalCreditsSpent}</h1>
        <p>Total Credits Spent</p>
        <Link to="/project-select">View all</Link>
      </div>
      <div className="statsWidget d-flex flex-wrap">
        {/* <div>
          <h4>{stats.avgCreditsPerDay}</h4>
          <p>Av. credits a day</p>
        </div> */}
        <div>
          <h4>{stats.data.timePeriodStart}</h4>
          <p>Time Period Start</p>
        </div>
        <div>
          <h4>{stats.data.timePeriodEnd}</h4>
          <p>Time Period End</p>
        </div>
        <div>
          <Dropdown isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle>
          
        {/* <h4>{stats.data.timeUnit}</h4>   */}
            <span>{timeValue} </span> <ExpandMoreIcon />
        </DropdownToggle>
        <DropdownMenu>
        <DropdownItem onClick={timeUnit}>
            Monthly
        </DropdownItem>
        <DropdownItem onClick={timeUnit}>
            Weekly
        </DropdownItem>
        <DropdownItem onClick={timeUnit}>
            Daily
        </DropdownItem>
        </DropdownMenu>
        </Dropdown>
          <p>Time Unit</p>
        </div>
        <div>
          <h4>{stats.data.progress}</h4>
          <p>Progress</p>
        </div>
      </div></>}
    </div>
  )

}


function mapStateToProps(state) {
  const { project } = state;
  // console.log("Stats >> mapStateToProps >> project >> ", project)
  return {
    stats: project.stats
  };
}


function mapDispatchToProps(dispatch) {
  return {
    actions: {
      projectActions: bindActionCreators(projectActions, dispatch),
      authActions: bindActionCreators(authActions, dispatch)
    }
  };
}

// export default connect(mapStateToProps)(Login);
export default connect(mapStateToProps, mapDispatchToProps)(Stats);
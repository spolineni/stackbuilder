import React, { useEffect } from 'react';
import './Profile.scss';
import { connect } from 'react-redux';
import * as projectActions from "../../redux/actions/projectActions";
import * as authActions from "../../redux/actions/authActions";
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { bindActionCreators } from 'redux';
import Loader from '../common/loader';
// import Project from '../project-select/Project';

function Profile({ projectList, user, selectedProject, actions, ...props }) {

  useEffect(() => {
    actions.authActions.userSessionLoad();
    actions.projectActions.getProjectSelected();
    actions.projectActions.getAllProjects();
  }, [actions]);

  function handleSelectProject(project) {
    actions.projectActions.projectSelect(project);
  }

  return (
    <div className="Profile container">
      <h1>My Profile</h1>
      <div className="d-flex profile-content">
        <AccountCircleIcon />
        <div className="userInfo">
          <p><span>Name</span> {user.username}</p>
          <p><span>Email</span> {user.email}</p>
          <div className="admin">
            <p>Need to modify this information?</p>
            <a href="mailto:someadmin@orgamization.com?subject=Please grant me access to Project" target='_blank' rel="noopener noreferrer">Contact your system administrator.</a>
          </div>
        </div>
        <div className="all-projects">
          <h6>My Projects</h6>
          <ul>
            {projectList.isFetching ? <Loader margin="10px" size="30px" /> :
              projectList.data.map((_project) => {
                return <li key={_project.Id} item={_project} onClick={() => handleSelectProject(_project)}    >{_project.DisplayName}</li>
              })
            }
          </ul>
        </div>
      </div>
    </div>
  )
}

function mapStateToProps(state) {
  const { project, auth } = state;
  return {
    user: auth.user,
    projectList: project.projectList,
    selectedProject: state.selectedProject
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      authActions: bindActionCreators(authActions, dispatch),
      projectActions: bindActionCreators(projectActions, dispatch)
    }
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(Profile);


// class Profile extends React.Component {

//   selectProject = (project) => {
//     this.props.dispatch(projectSelect(project));
//     this.props.dispatch(getStats());
//     this.props.dispatch(getRecent());
//     this.props.dispatch(getProvisionedProducts());
//   }

//   render() {
//     const { items } = this.props;
//     return (
//       <div className="Profile container">
//         <h1>My Profile</h1>
//         <div className="d-flex profile-content align-items-center">
//           <AccountCircleIcon />
//           <div>
//             <p><span>Name</span> Jane Brown</p>
//             <p><span>Email</span> jane.brown@university.edu</p>
//             <div className="admin">
//               <p>Need to modify this information?</p>
//               <Link to="/">Contact your system administrator.</Link>
//             </div>
//           </div>
//           <div className="all-projects">
//             <h6>My Projects</h6>
//             <ul>
//               {
//                 items.map((item, i) => {
//                   return <li key={i} item={item} onClick={() => this.selectProject(item)}>{item.name}</li>
//                 })
//               }
//             </ul>
//           </div>
//         </div>
//       </div>
//     )
//   }
// }

// function mapStateToProps(state) {
//   const { projectsList } = state;
//   const { items } = projectsList;
//   return {
//     items
//   }
// }

// export default connect(mapStateToProps)(Profile);
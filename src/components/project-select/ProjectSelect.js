import React, { useEffect } from 'react';
import './ProjectSelect.scss';
import { connect } from 'react-redux';
import * as projectActions from "../../redux/actions/projectActions";
import * as authActions from "../../redux/actions/authActions";
import { bindActionCreators } from 'redux';
import Project from './Project';
import Loader from '../common/loader'

function ProjectSelect({ projectList, selectedProject, actions, ...props }) {

  useEffect(() => {
    // actions.projectActions.getProjectSelected();
    actions.projectActions.getAllProjects();
  }, [actions]);

  function handleSelectProject(project) {
    actions.projectActions.projectSelect(project);
  }

  return (
    <div className="ProjectSelect container">
      <h1>Choose your Project</h1>
      <div className="products d-inline-flex flex-wrap">
        {projectList.isFetching ? <Loader /> :
          projectList.data.map(function (_project) {
            const portfolioImageTags = _project.Tags.filter(tag => tag.Key === 'PortfolioImage');
            let portfolioImageUrl = '';
            if (portfolioImageTags.length > 0) {
              portfolioImageUrl = portfolioImageTags[0].Value
            }
            return <Project key={_project.PortfolioDetail.Id} project={_project.PortfolioDetail} portfolioImageUrl={portfolioImageUrl} selectProject={handleSelectProject} />
          })
        }
      </div>
      <p>Don't see your project? <a href="mailto:someadmin@orgamization.com?subject=Please grant me access to Project" target='_blank' rel="noopener noreferrer">Contact your system administrator here.</a></p>
    </div>
  )
}

function mapStateToProps(state) {
  const { project } = state;
  // debugger
  return {
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

// export default connect(mapStateToProps)(Login);
export default connect(mapStateToProps, mapDispatchToProps)(ProjectSelect);
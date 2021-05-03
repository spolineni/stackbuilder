import React from 'react';
import './Project.scss';
import { connect } from 'react-redux';

// class Project extends React.Component {
function Project({ project, selectProject, portfolioImageUrl = '', ...props }) {
  // console.log(JSON.stringify(project));
  return (
    <div className="Project d-flex flex-column justify-content-between" onClick={() => selectProject(project)}>
      <img alt="PortfolioImage" src={portfolioImageUrl} />
      <h4>{project.DisplayName}</h4>
      {/* <p><span>Num of products:</span> 0 </p> */}
    </div>
  )
}

export default connect()(Project);
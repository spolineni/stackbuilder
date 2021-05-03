import React, { useEffect } from 'react';

import './Homepage.scss';
import { connect } from 'react-redux';
import Stats from './Stats';
import ProvisionedProductsGrid from './ProvisionedProductsGrid';
import ProvisionedProductsTable from './ProvisionedProductsTable';
import { Button } from 'reactstrap';
import AddIcon from '@material-ui/icons/Add';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import ViewListIcon from '@material-ui/icons/ViewList';
import * as projectActions from "../../redux/actions/projectActions";
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';

function ProjectDetails({ projectList, provisionedProducts, tableView, selectedProject, actions, ...props }) {

  useEffect(() => {
    actions.projectActions.getProjectSelected();
    actions.projectActions.getAllProjects();
    actions.projectActions.getProvisionedProducts();
  }, [actions]);


  function toggleTable(event) {
    actions.projectActions.changeView();
  }

  return (
    <div className="container homepage">
      <Stats selectedProject={selectedProject} />
      <div className="provisionedProducts">
        <div className="header d-flex justify-content-between align-items-center">
          <div className="d-flex align-items-center">
            <h4>All Provisioned Products <span>in {selectedProject.DisplayName}</span></h4>
            <Button className="d-flex align-items-center"><Link to="/products-catalog"><AddIcon /><span>Launch New Product</span></Link></Button>
          </div>
          <div className="d-flex align-items-center viewBy">
            <p>View by:</p>
            {
              tableView ? <ViewModuleIcon onClick={toggleTable} /> : <ViewListIcon onClick={toggleTable} />
            }
          </div>
        </div>
        {
          tableView ?
            <ProvisionedProductsTable productData={provisionedProducts} /> :
            <ProvisionedProductsGrid productData={provisionedProducts} />
        }
      </div>
    </div>
  )
}

function mapStateToProps(state) {
  const { project } = state;
  // console.log("HomePage >> mapStateToProps >> project >> ", project)
  return {
    // provisionedProducts: project.provisionedProducts,
    // user: auth.user,
    tableView: project.tableView,
    selectedProject: project.selectedProject,
    projectList: project.projectList
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: {
      projectActions: bindActionCreators(projectActions, dispatch)
    }
  };

}

// export default connect(mapStateToProps)(Login);
export default connect(mapStateToProps, mapDispatchToProps)(ProjectDetails);
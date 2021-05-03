import React from 'react';
import './Header.scss';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Alert,
  Button
} from 'reactstrap';
import { withRouter, Link, NavLink as RRNavLink, useLocation } from 'react-router-dom';
import { connect } from 'react-redux';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { bindActionCreators } from 'redux';
import * as projectActions from "../../redux/actions/projectActions";
import * as authActions from "../../redux/actions/authActions";
import AddIcon from '@material-ui/icons/Add';

const iconPath = process.env.PUBLIC_URL + '/images/';

function Header({ user, projectList, bannerData, selectedProject, actions, isOpen = true, ...props }) {
  let location = useLocation();

  function selectProject(project) {
    actions.projectActions.projectSelect(project);
    actions.projectActions.getProjectSelected();
    actions.projectActions.getAllProjects();
    actions.projectActions.getProvisionedProducts();
    actions.projectActions.getStats();
  }

  function logout() {
    actions.authActions.logout();
  }

  // if (Object.keys(user).length === 0 && user.constructor === Object) {
  //   return <Redirect to="/login" />
  // }

  return (
    <div className="app-header">
      <div className="primary-navbar">
        <Navbar expand="lg" className="container">
          <NavbarBrand href="/" className="logo">
            <img src={`${iconPath}header-logo.png`} alt="" className="header-logo" />
          </NavbarBrand>
          <NavbarToggler />
          {location.pathname !== '/login' && location.pathname !== '/project-select' ?
            <Collapse isOpen={isOpen} navbar>
              <Nav className="mr-auto" navbar>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav>
                    {selectedProject.DisplayName} <ExpandMoreIcon />
                  </DropdownToggle>
                  <DropdownMenu right>
                    {
                      projectList.data.map((project) => {
                        let className = ''
                        if (project.PortfolioDetail.DisplayName === selectedProject.DisplayName) {
                          className = 'selected';
                        }
                        return <DropdownItem key={project.PortfolioDetail.Id} onClick={() => selectProject(project.PortfolioDetail)} className={className} >
                          {project.PortfolioDetail.DisplayName}
                        </DropdownItem>
                      })
                    }
                    <DropdownItem divider />
                    <DropdownItem>
                      Don't see your project? <br /> <a href="mailto:someadmin@orgamization.com?subject=Please grant me access to Project" target='_blank' rel="noopener noreferrer" className="contact-admin">Contact your system administrator.</a>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>

              </Nav>
              <Nav>
                <NavItem>
                  <NavLink tag={Link} to="/products-catalog" className="new-product"><Button className="d-flex align-items-center"><AddIcon /><span>Launch New Product</span></Button></NavLink>
                </NavItem>
                <NavItem>
                  <NavLink target="_blank" href="https://docs.aws.amazon.com/" >Knowledge Base</NavLink>
                </NavItem>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav>
                    {user.username} <ExpandMoreIcon />
                  </DropdownToggle>
                  <DropdownMenu right className="user-dropdown">
                    <DropdownItem tag={Link} to="/profile"  >My Profile</DropdownItem>
                    <DropdownItem onClick={logout} >Logout <ArrowForwardIcon /></DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Nav>
            </Collapse> : ''}
        </Navbar>
      </div>
      {location.pathname !== '/login' && location.pathname !== '/project-select' && localStorage.getItem('selectedProject') ?

        <div className="secondary-navbar">
          <Navbar className="container">
            <Nav className="container justify-content-start">
              <NavItem>
                <NavLink tag={RRNavLink} to="/" activeClassName="active" exact>My Products</NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={RRNavLink} to="/project-details" activeClassName="active" exact>All {selectedProject.DisplayName} products</NavLink>
              </NavItem>
            </Nav>
          </Navbar>
        </div>
        : ''}
      {bannerData.show ?
        <div className={`alert-container ${bannerData.status}`}>
          <Alert toggle={() => actions.projectActions.closeBanner()} className="container">
            {bannerData.text}
          </Alert>
        </div> : ''}
    </div>
  )

}


function mapStateToProps(state) {
  const { project, auth } = state;
  // console.log("Header >> mapStateToProps >> auth >> ", auth)
  // console.log("Header >> mapStateToProps >> project >> ", project)
  return {
    user: auth.user,
    selectedProject: project.selectedProject,
    projectList: project.projectList,
    bannerData: project.bannerData
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

// function mapDispatchToProps(dispatch) {
//   return {
//     actions: bindActionCreators(projectActions, dispatch)
//   };
// }
// export default connect(mapStateToProps)(Login);
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));

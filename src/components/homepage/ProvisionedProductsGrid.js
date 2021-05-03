import React from 'react';
import './ProvisionedProductsGrid.scss';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button } from 'reactstrap';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';

import * as projectActions from "../../redux/actions/projectActions";

function ProvisionedProductsGrid({ selectedProject, provisionedProducts, actions, ...props }) {

  function redirectToDetailsPage(provisionedProduct) {
    actions.projectActions.getProvisionedProductDetails(provisionedProduct);
  }

  function renderStatus(status) {
    switch (status) {
      case 'SUCCEEDED':
      case 'AVAILABLE':
        return (<div className="d-inline-flex status align-items-center success-badge">
          <CheckCircleIcon />
          <p>{status}</p>
        </div>)
      case 'ERROR':
      case 'FAILED':
        return (
          <div className="d-inline-flex status align-items-center error-badge">
            <ErrorIcon />
            <p>{status}</p>
          </div>
        );
      default:
        return (
          <div className="d-inline-flex status align-items-center not-running-badge">
            <PauseCircleFilledIcon />
            <p>{status}</p>
          </div>
        );
    }
  }

  function renderTags(provisionedProduct) {
    const productTypeTags = provisionedProduct.Tags.filter(tag => tag.Key === 'ProductType');
    let productTypeTag = [];
    let typeTags = '';
    if (productTypeTags.length > 0) {
      productTypeTag = productTypeTags.map(tag => tag.Value.split(":"));
      typeTags = productTypeTag[0].join(' | ');
    }
    return (
      typeTags
    );
  }

  return (
    <div className="row products-grid">
      {
        provisionedProducts.data.map(provisionedProduct => {
          return (
            <div className="myProvisonedProducts col-md-3" key={provisionedProduct.Id} >
              <div className="col-md-12">
                {renderStatus(provisionedProduct.Status)}
                <h4>{provisionedProduct.Name}</h4>
                <p className="type">{renderTags(provisionedProduct)}</p>
                <p className="id">{provisionedProduct.Id}</p>
                <p className="createdOn">Created: <span>{provisionedProduct.CreatedTime.toISOString()}</span></p>
                <div className="d-flex align-items-center launch">
                  <Button onClick={() => redirectToDetailsPage(provisionedProduct)} >Manage Product</Button>
                </div>
              </div>
            </div>
          )
        })
      }

    </div>
  )
}


function mapStateToProps(state) {
  const { project } = state;
  // console.log("ProvisionedProductsGrid >> mapStateToProps >> project >> ", project)
  return {
    provisionedProducts: project.provisionedProducts,
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
export default connect(mapStateToProps, mapDispatchToProps)(ProvisionedProductsGrid);

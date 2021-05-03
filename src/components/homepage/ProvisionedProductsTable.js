import React, { useEffect, useState } from 'react';
import './ProvisionedProductsTable.scss';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as projectActions from "../../redux/actions/projectActions";
import { Table, Button, Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalBody, ModalFooter } from 'reactstrap';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import MoreVertIcon from '@material-ui/icons/MoreVert';

function ProvisionedProductsDropDownMenu({ provisionedProduct, redirectToDetailsPage, terminateProvisionedProduct, ...props }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  //const [connectModal, setConnectModal] = useState(false);
  //const connectToggle = (provisionedProduct) => setConnectModal(!connectModal);

  function toggleDropdown() {
    setDropdownOpen(!dropdownOpen)
  }

  return (
    <>
      <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
        <DropdownToggle tag="div">
          <MoreVertIcon />
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem onClick={() => redirectToDetailsPage(provisionedProduct)}  >Manage</DropdownItem>
          {/* <DropdownItem onClick={() => connectToggle(provisionedProduct)}  >Connect</DropdownItem> */}
          <DropdownItem onClick={() => terminateProvisionedProduct(provisionedProduct)}  >Terminate</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      {/* <div>
        <Modal isOpen={connectModal} toggle={connectToggle}>
          <ModalBody>
            Click Yes to terminate this product
          </ModalBody>
          <ModalFooter>
            <Button className="modal-primary" onClick={() => terminateProvisionedProduct(provisionedProduct)}>Yes</Button>{' '}
            <Button className="modal-secondary" onClick={connectToggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
      </div> */}
    </>
  )

}

function ProvisionedProductsTable({ selectedProject, provisionedProducts, actions, ...props }) {
  useEffect(() => {
    // actions.getProvisionedProducts(selectedProject);
  }, [selectedProject, actions]);


  function redirectToDetailsPage(provisionedProduct) {
    actions.projectActions.getProvisionedProductDetails(provisionedProduct);
  }

  function terminateProvisionedProduct(provisionedProduct) {
    console.log("ProvisionedProductsDropDownMenu >>> ", provisionedProduct);
    actions.projectActions.terminateProvisionedProduct(provisionedProduct);
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
    <Table hover className="product-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Type</th>
          <th>I.D.</th>
          <th>Created</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead><tbody>
        {
          provisionedProducts.data.map(provisionedProduct => {
            return (
              <tr className="productRow" key={provisionedProduct.Id} >
                <td>{provisionedProduct.Name}</td>
                <td>{renderTags(provisionedProduct)}</td>
                <td>{provisionedProduct.Id}</td>
                <td>{provisionedProduct.CreatedTime.toISOString()}</td>
                <td>
                  {renderStatus(provisionedProduct.Status)}
                </td>
                <td>
                  <ProvisionedProductsDropDownMenu redirectToDetailsPage={redirectToDetailsPage} terminateProvisionedProduct={terminateProvisionedProduct} provisionedProduct={provisionedProduct} />
                </td>
              </tr>
            )
          })
        }
      </tbody>
    </Table>
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

export default connect(mapStateToProps, mapDispatchToProps)(ProvisionedProductsTable);
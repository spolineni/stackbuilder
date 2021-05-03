import React, { useState } from 'react';
import './ProvisionedProductDetails.scss';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import PauseCircleFilledIcon from '@material-ui/icons/PauseCircleFilled';
import { Table, Button, Modal, ModalBody, ModalFooter } from 'reactstrap';
import EventOutput from './EventOutput';
import * as projectActions from "../../redux/actions/projectActions";
import * as authActions from "../../redux/actions/authActions";
import { Redirect } from 'react-router-dom';
import * as _utils from '../../helpers/utils';
import RefreshIcon from '@material-ui/icons/Refresh';
import CloseIcon from '@material-ui/icons/Close';

function ProvisionedProductDetails({ serviceActionResult, provisionedProductDetails, actions, ...props }) {

  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

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

  function executeServiceAction(provisionedProduct, serviceAction) {
    actions.projectActions.executeServiceActionForProvisionedProduct(provisionedProduct.ProvisionedProduct, serviceAction);
  }

  function refreshProvisionedProductDetails(provisionedProduct) {
    actions.projectActions.getProvisionedProductDetails(provisionedProduct.ProvisionedProduct);
  }

  function terminateProvisionedProduct(provisionedProduct) {
    actions.projectActions.terminateProvisionedProduct(provisionedProduct.ProvisionedProduct);
  }



  if (_utils.isEmpty(provisionedProductDetails)) {
    return <Redirect to="/" />
  }
  else {
    return (
      <div className="ProvisionedProductDetails container">
        {
          !_utils.isEmpty(serviceActionResult) ? (<div>{JSON.stringify(serviceActionResult)}</div>) : (<></>)
        }
        <div className="product-details">
          <h1>{provisionedProductDetails.ProvisionedProduct.Name}
            <Button onClick={() => refreshProvisionedProductDetails(provisionedProductDetails)} ><RefreshIcon /></Button>
            {/* <Button onClick={() => terminateProvisionedProduct(provisionedProductDetails)} ><CloseIcon /></Button> */}
            <Button onClick={toggle} ><CloseIcon /></Button>
          </h1>
          <div className="d-flex action-buttons">
            {provisionedProductDetails.ServiceActions.map(serviceAction => {
              return <Button key={serviceAction.Id} onClick={() => executeServiceAction(provisionedProductDetails, serviceAction)} >{serviceAction.Name}</Button>
            })}
          </div>
          <div className="row">
            <div className="col-md-5" >
              {renderStatus(provisionedProductDetails.ProvisionedProduct.Status)}
              <p><span>Date Created</span> {provisionedProductDetails.ProvisionedProduct.CreatedTime.toISOString()}</p>
              <p><span>Product</span> {provisionedProductDetails.ProvisionedProduct.ProductId}</p>
              <p><span>Version</span> {provisionedProductDetails.ProductDetails.ProvisioningArtifacts[0].Name}</p>
              <p><span>Provided by</span> {provisionedProductDetails.ProductDetails.ProductViewSummary.Owner}</p>
            </div>
            <div className="col-md-5">
              <p><span>Support</span> <a href={`mailto:${provisionedProductDetails.ProductDetails.ProductViewSummary.SupportEmail}`}>{provisionedProductDetails.ProductDetails.ProductViewSummary.SupportEmail}</a></p>
              <p><span>Support Link</span> <a href={provisionedProductDetails.ProductDetails.ProductViewSummary.SupportUrl} rel="noopener noreferrer" target="_blank" >{provisionedProductDetails.ProductDetails.ProductViewSummary.SupportUrl}</a></p>
              <p><span className="d-block">Support Description</span> {provisionedProductDetails.ProductDetails.ProductViewSummary.SupportDescription}</p>
            </div>
          </div>
        </div>
        {
          !_utils.isEmpty(provisionedProductDetails.RecordHistory) && provisionedProductDetails.RecordHistory.length > 0 ?
            (
              <div className="events">
                <h3>Events</h3>
                <div className="row">
                  <div className="col-md-3">
                    <div className="d-flex align-items-center event-status">
                      <span>Status</span>
                      {/* ProvisionedProductDetail */}
                      {renderStatus(provisionedProductDetails.RecordHistory[0].RecordDetail.Status)}
                    </div>
                    {/* {JSON.stringify(status)} */}
                    <p><span>Record ID</span> {provisionedProductDetails.RecordHistory[0].RecordDetail.RecordId}</p>
                    <p><span>Provisioned product ID</span> {provisionedProductDetails.RecordHistory[0].RecordDetail.ProvisionedProductId}</p>
                    <p><span>Type</span> {provisionedProductDetails.RecordHistory[0].RecordDetail.RecordType}</p>
                    <p><span className="d-block wrap">Event Message</span> None</p>
                  </div>
                  <div className="col-md-9">
                    <p className="title">Output</p>
                    <Table hover>
                      <thead>
                        <tr>
                          <th>Key</th>
                          <th>Value</th>
                          <th>Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {provisionedProductDetails.RecordHistory[0].RecordOutputs.map(recordOutput => {
                          return <EventOutput eventOutput={recordOutput} key={recordOutput.OutputKey} />
                        })}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </div>
            ) : (<></>)
        }

        <div>
          <Modal isOpen={modal} toggle={toggle}>
            <ModalBody>
              Click Yes to terminate this product
            </ModalBody>
            <ModalFooter>
              <Button className="modal-primary" onClick={() => terminateProvisionedProduct(provisionedProductDetails)}>Yes</Button>{' '}
              <Button className="modal-secondary" onClick={toggle}>Cancel</Button>
            </ModalFooter>
          </Modal>
        </div>
      </div >
    )
  }
}


function mapStateToProps(state) {
  const { project } = state;
  return {
    provisionedProductDetails: project.provisionedProductDetails,
    serviceActionResult: project.serviceActionResult
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

export default connect(mapStateToProps, mapDispatchToProps)(ProvisionedProductDetails);
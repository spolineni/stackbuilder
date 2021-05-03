import React, { useState } from 'react';
import './ProvisionProduct.scss';
import { connect } from 'react-redux';
import * as projectActions from "../../redux/actions/projectActions";
import { bindActionCreators } from 'redux';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';


function ProvisionProduct({ catalogProduct, actions, ...props }) {

  const [resourceName, setResourceName] = useState('')
  const [formValues, setFormValues] = useState({})
  const [wizardStep1, setWizardStep1] = useState(true)
  const [wizardStep2, setWizardStep2] = useState(false)


  function triggerSteps(step1, step2) {
    setWizardStep1(step1);
    setWizardStep2(step2);
  }

  function onParamChange(event) {
    if (event.target.name === 'resourceName') {
      setResourceName(event.target.value);
    }
    else {
      setFormValues({ ...formValues, [event.target.name]: event.target.value });
    }
  };

  function launchProduct() {
    actions.provisionProduct(catalogProduct, resourceName, formValues);
  }

  if (!catalogProduct)
    return <Redirect to="products-catalog" />

  const { product, artifact, provisioningParameters } = catalogProduct;
  return (
    <div className="provision-product container">
      <h1>{product.ProductViewSummary.Name}</h1>
      <div className="step-1">
        <div className="d-flex step-title align-items-end">
          <h3>Product Version: {artifact.Name}</h3>
          {!wizardStep1 && <p onClick={() => triggerSteps(true, false)}>Change</p>}
        </div>
        <p className="product-description">{product.ProductViewSummary.ShortDescription}</p>
        <Form>
          <FormGroup>
            <Label for="name">Name your product</Label>
            {wizardStep1 && <Input type="text" name="resourceName" id="resourceName" placeholder="Enter Resource Name" onChange={onParamChange} className="col-3" value={resourceName || ''} />}
            {!wizardStep1 && <p>{resourceName}</p>}
          </FormGroup>
          {wizardStep1 && <Button onClick={() => triggerSteps(false, false)}>Continue</Button>}
        </Form>
      </div>
      <CSSTransition
        in={!wizardStep1}
        timeout={300}
        classNames="alert"
        unmountOnExit
      >
      {/* {!wizardStep1 && */}
        <div className="step-2">
          <div className="d-flex step-title align-items-end">
            <h3>Parameters</h3>
            {wizardStep2 && <p onClick={() => triggerSteps(false, false)}>Change</p>}
          </div>
          <Form>
            {
              provisioningParameters.map(param => {
                return (
                  <FormGroup key={param.ParameterKey} className="col-3">
                    <Label for="parameter1">{param.ParameterKey}</Label>
                    {!wizardStep2 &&
                      <>
                        <Input type="text" name={param.ParameterKey} id={param.ParameterKey} placeholder={param.DefaultValue}
                          value={formValues[param.ParameterKey] || ''}
                          onChange={onParamChange} />
                        <p className="param-description">{param.Description}</p>
                      </>}
                    {wizardStep2 && <p>{formValues[param.ParameterKey]}</p>}
                  </FormGroup>
                );
              })
            }
            {!wizardStep2 && <Button onClick={() => triggerSteps(false, true)}>Review</Button>}
            {wizardStep2 && <Button onClick={launchProduct} >Launch Product</Button>}
          </Form>
        </div>
      {/* } */}
      </CSSTransition>
    </div>
  )

}

function mapStateToProps(state) {
  const { project } = state;
  return {
    catalogProduct: project.catalogProduct,
    selectedProject: project.selectedProject
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(projectActions, dispatch)
  };
}

// export default connect(mapStateToProps)(Login);
export default connect(mapStateToProps, mapDispatchToProps)(ProvisionProduct);

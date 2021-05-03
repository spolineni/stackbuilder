import React, { useState, useEffect } from 'react';
import './ProductsCatalog.scss';
import { connect } from 'react-redux';
import Product from './Product';
import { bindActionCreators } from 'redux';
import * as projectActions from "../../redux/actions/projectActions";
import Loader from '../common/loader';

function ProductsCatalog({ productsCatalog, selectedProject, actions, ...props }) {
  const [productType] = useState(['Compute', 'Monitoring', 'Analytics', 'Storage'])
  const [selectedProductType, setSelectedProductType] = useState([])

  function selectProductType(type) {
    if (!selectedProductType.includes(type)) {
      setSelectedProductType([...selectedProductType, type])
    } else {
      setSelectedProductType(selectedProductType.filter(pt => pt !== type));
    }
  }

  function getStartedAction(catalogProducts) {
    actions.provisionProductIntent(catalogProducts);
  }

  useEffect(() => {
    actions.getProjectSelected();
    actions.getProductsCatalogItems();
  }, [actions]);


  return (
    <div className="productsCatalog container">
      <h2 className="title">Products available <span>in {selectedProject.DisplayName}</span></h2>
      <div className="pills d-flex align-items-center">
        <p>View products containing:</p>
        <ul className="d-flex">
          {
            productType.map((type, i) => {
              return <li key={i} onClick={() => selectProductType(type)} className={selectedProductType.includes(type) ? 'active' : null}>{type}</li>
            })
          }
        </ul>
      </div>
      <div className="row">
        {
          productsCatalog.isFetching ? <Loader /> :
            productsCatalog.data.map((catalogProduct, i) => {
              console.log("ProductsCatalog >> catalogProduct >> ", catalogProduct);
              const productTypeTags = catalogProduct.tags.filter(tag => tag.Key === 'ProductType');
              let productTypeTag = [];
              let intersection = [];
              let typeTags = '';
              if (productTypeTags.length > 0) {
                productTypeTag = productTypeTags.map(tag => tag.Value.split(":"));
                intersection = selectedProductType.filter(x => productTypeTag[0].includes(x));
                typeTags = productTypeTag[0].join(' | ');
              }

              const comingSoonTags = catalogProduct.tags.filter(tag => tag.Key === 'ComingSoon');
              let comingSoon = false;
              if (comingSoonTags.length > 0) {
                comingSoon = true
              }

              const productImageTags = catalogProduct.tags.filter(tag => tag.Key === 'ProductImage');
              let productImageUrl = '';
              if (productImageTags.length > 0) {
                productImageUrl = productImageTags[0].Value
              }

              if (intersection.length !== 0 || selectedProductType.length === 0) {
                return <Product catalogProduct={catalogProduct} getStartedAction={getStartedAction} productImageUrl={productImageUrl} comingSoon={comingSoon} typeTags={typeTags} key={i} />;
              }
              return null
            })
        }
      </div>
    </div>
  )
  // }
}

function mapStateToProps(state) {
  const { project } = state;
  // console.log("ProductsCatalog >> mapStateToProps >> project >> ", project)
  return {
    selectedProject: project.selectedProject,
    productsCatalog: project.productsCatalog
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(projectActions, dispatch)
  };
}

// export default connect(mapStateToProps)(Login);
export default connect(mapStateToProps, mapDispatchToProps)(ProductsCatalog);
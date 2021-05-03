import React, { useEffect, useState } from 'react';
import './ProductsCatalogWidget.scss';
import { Button } from 'reactstrap';
import Slider from "react-slick";
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as projectActions from "../../redux/actions/projectActions";
import Loader from '../common/loader';
import Product from '../products-catalog/Product';
import { isEmpty } from '../../helpers/utils';

// class ProductsCatalogWidget extends React.Component {
function ProductsCatalogWidget({ productsCatalog, selectedProject, actions, ...props }) {
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

  // useEffect(() => {
  //   actions.getProjectSelected();
  //   actions.getProductsCatalogItems();
  // }, [selectedProject, productsCatalog, actions]);


  function NextArrow(props) {
    const { className, onClick } = props;
    return (
      <NavigateNextIcon onClick={onClick} className={className} />
    );
  }

  function PrevArrow(props) {
    const { className, onClick } = props;
    return (
      <NavigateBeforeIcon onClick={onClick} className={className} />
    );
  }

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />
  };

  function truncate(str) {
    const max_len = 65;
    return str.length > max_len ? str.substring(0, max_len) + "..." : str;
  }

  function renderProductImage(catalogProduct) {
    const productImageTags = catalogProduct.tags.filter(tag => tag.Key === 'ProductImage');
    let productImageUrl = '';
    if (productImageTags.length > 0) {
      productImageUrl = productImageTags[0].Value
    }
    return <img alt="productpicture" src={productImageUrl} />
  }

  // function renderRecentlyUsedProductView(recentlyUsed) {
  //   if (isEmpty(recentlyUsed) || recentlyUsed.length < 1) {
  //     return <div>None</div>;
  //   }
  //   else {
  //     return recentlyUsed.map((catalogProduct, i) => {
  //       const productTypeTags = catalogProduct.tags.filter(tag => tag.Key === 'ProductType');
  //       let productTypeTag = [];
  //       let typeTags = '';
  //       if (productTypeTags.length > 0) {
  //         productTypeTag = productTypeTags.map(tag => tag.Value.split(":"));
  //         typeTags = productTypeTag[0].join(' | ');
  //       }
  //       return (
  //         <div className="ProductsCatalogWidget" key={catalogProduct.product.ProductViewSummary.Id} >
  //           {renderProductImage(catalogProduct)}
  //           {/* <img src="https://ncl-webpages.s3.amazonaws.com/Picture1.svg" /> */}
  //           <h4>{catalogProduct.product.ProductViewSummary.Name}</h4>
  //           <p>{typeTags}&nbsp;</p>
  //           {/* <p>Spot Block: <span>30 credits</span></p>
  //         <p>On-Demand: <span>90 credits</span></p> */}
  //           <p className="description">{truncate(catalogProduct.product.ProductViewSummary.ShortDescription)}</p>
  //           <div className="d-flex align-items-center launch">
  //             <Button onClick={() => getStartedAction(catalogProduct)} >Launch</Button>
  //             {/* <a href="#">Learn more</a> */}
  //           </div>
  //         </div>
  //       )
  //     })
  //   }
  // }

  function renderProductCatalogView(productsCatalog) {
    if (isEmpty(productsCatalog) || productsCatalog.length < 1) {
      return <div>None</div>;
    }
    else {
      return productsCatalog.map((catalogProduct, i) => {
        console.log("ProductsCatalog >> catalogProduct >> ", catalogProduct);
        const productTypeTags = catalogProduct.tags.filter(tag => tag.Key === 'ProductType');
        let productTypeTag = [];
        let typeTags = '';
        if (productTypeTags.length > 0) {
          productTypeTag = productTypeTags.map(tag => tag.Value.split(":"));
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

        return (
          <div className="ProductsCatalogWidget" key={catalogProduct.product.ProductViewSummary.Id} >
            <div className={`banner ${comingSoon ? "active" : ""}`}>Coming Soon</div>
            {renderProductImage(catalogProduct)}
            <h4>{catalogProduct.product.ProductViewSummary.Name}</h4>
            <p>{typeTags}&nbsp;</p>
            <p className="description">{truncate(catalogProduct.product.ProductViewSummary.ShortDescription)}</p>
            {!comingSoon &&
              <div className="d-flex align-items-center launch">
                <Button onClick={() => getStartedAction(catalogProduct)} >Get Started</Button>
              </div>
            }
          </div>
        )
      })
    }
  }

  return (
    <div className="recentlyUsed">
      <h4 className="title">Available Products</h4>
      {/* {recentlyUsed.isFetching ? <Loader /> :
        <Slider {...settings} className="">
          {renderRecentlyUsedProductView(recentlyUsed.data)}
        </Slider>
      } */}
      {productsCatalog.isFetching ? <Loader /> :
        <Slider {...settings} className="">
          {renderProductCatalogView(productsCatalog.data)}
          {/* <div className="ProductsCatalogWidget" key={21312311} >One</div>
          <div className="ProductsCatalogWidget" key={21312321} >Two</div>
          <div className="ProductsCatalogWidget" key={21312231} >Three</div>
          <div className="ProductsCatalogWidget" key={21312231} >Three</div>
          <div className="ProductsCatalogWidget" key={213122331} >Three</div>
          <div className="ProductsCatalogWidget" key={2131222231} >Three</div>
          <div className="ProductsCatalogWidget" key={2131223231} >Three</div>
          <div className="ProductsCatalogWidget" key={21312231} >Three</div>
          <div className="ProductsCatalogWidget" key={213162231} >Three</div> */}
        </Slider>
      }
    </div>
  )
}


function mapStateToProps(state) {
  const { project } = state;
  // console.log("ProductsCatalogWidget >> mapStateToProps >> project >> ", project)
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

export default connect(mapStateToProps, mapDispatchToProps)(ProductsCatalogWidget);
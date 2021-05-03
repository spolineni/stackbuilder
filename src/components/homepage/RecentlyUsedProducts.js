import React, { useEffect } from 'react';
import './RecentlyUsedProducts.scss';
import { Button } from 'reactstrap';
import Slider from "react-slick";
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import NavigateBeforeIcon from '@material-ui/icons/NavigateBefore';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as projectActions from "../../redux/actions/projectActions";
import { isEmpty } from '../../helpers/utils';
import Loader from '../common/loader';

// class RecentlyUsedProducts extends React.Component {
function RecentlyUsedProducts({ selectedProject, productsCatalog, provisionedProducts, recentlyUsed, actions, ...props }) {

  useEffect(() => {
    actions.getRecentlyUsedProducts();
  }, [selectedProject, productsCatalog, provisionedProducts, actions]);


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

  function getStartedAction(catalogProducts) {
    actions.provisionProductIntent(catalogProducts);
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

  function renderRecentlyUsedProductView(recentlyUsed) {
    if (isEmpty(recentlyUsed) || recentlyUsed.length < 1) {
      return <div>None</div>;
    }
    else {
      return recentlyUsed.map((catalogProduct, i) => {
        const productTypeTags = catalogProduct.tags.filter(tag => tag.Key === 'ProductType');
        let productTypeTag = [];
        let typeTags = '';
        if (productTypeTags.length > 0) {
          productTypeTag = productTypeTags.map(tag => tag.Value.split(":"));
          typeTags = productTypeTag[0].join(' | ');
        }
        return (
          <div className="recentlyUsedProducts" key={catalogProduct.product.ProductViewSummary.Id} >
            {renderProductImage(catalogProduct)}
            {/* <img src="https://ncl-webpages.s3.amazonaws.com/Picture1.svg" /> */}
            <h4>{catalogProduct.product.ProductViewSummary.Name}</h4>
            <p>{typeTags}&nbsp;</p>
            {/* <p>Spot Block: <span>30 credits</span></p>
          <p>On-Demand: <span>90 credits</span></p> */}
            <p className="description">{truncate(catalogProduct.product.ProductViewSummary.ShortDescription)}</p>
            <div className="d-flex align-items-center launch">
              <Button onClick={() => getStartedAction(catalogProduct)} >Launch</Button>
              {/* <a href="#">Learn more</a> */}
            </div>
          </div>
        )
      })
    }
  }

  return (
    <div className="recentlyUsed">
      <h4 className="title">Recently used products</h4>
      {recentlyUsed.isFetching ? <Loader /> :
        <Slider {...settings} className="">
          {renderRecentlyUsedProductView(recentlyUsed.data)}
        </Slider>
      }
    </div>
  )
}


function mapStateToProps(state) {
  const { project } = state;
  // console.log("RecentlyUsedProducts >> mapStateToProps >> project >> ", project)
  return {
    recentlyUsed: project.recentlyUsed,
    productsCatalog: project.productsCatalog,
    selectedProject: project.selectedProject,
    projectList: project.projectList
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(projectActions, dispatch)
  };
}

// export default connect(mapStateToProps)(Login);
export default connect(mapStateToProps, mapDispatchToProps)(RecentlyUsedProducts);

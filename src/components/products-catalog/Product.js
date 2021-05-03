import React from 'react';
import './Product.scss';
import { Button } from 'reactstrap';

function Product({ catalogProduct, typeTags, productImageUrl = '', comingSoon = false, getStartedAction, ...props }) {
  const { product } = catalogProduct;

  function truncate(str) {
    const max_len = 65;
    return str.length > max_len ? str.substring(0, max_len) + "..." : str;
  }

  return (
    <div className="product col-md-3">
      <div className={`banner ${comingSoon ? "active" : ""}`}>Coming Soon</div>
      <div className="col-md-12">
        <img alt="productpicture" src={productImageUrl} />
        <h4>{product.ProductViewSummary.Name}</h4>
        <p>{typeTags}</p>
        <p className="description">{truncate(product.ProductViewSummary.ShortDescription)}</p>
        {!comingSoon &&
          <div className="d-flex align-items-center launch">
            <Button onClick={() => getStartedAction(catalogProduct)} >Get Started</Button>
          </div>
        }
      </div>
    </div>
  )
}
export default Product;
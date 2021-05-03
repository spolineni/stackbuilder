import React from 'react';
import './Footer.scss';
import { withRouter, Link, useLocation } from 'react-router-dom';

const iconPath = process.env.PUBLIC_URL + '/images/';

function Footer({ ...props }) {
  let location = useLocation();
  return (
    <div className="footer">
      <section className="top">
        <div className="container d-flex justify-content-between align-items-end">
          <div className="logo">
            <img src={`${iconPath}footer-logo.png`} alt="" className="footer-logo" />
          </div>
          <div className="footer-links">
            <ul className="d-flex">
              {location.pathname !== '/login' ? location.pathname !== '/project-select' ?
                <><li><a href="https://docs.aws.amazon.com/" rel="noopener noreferrer" target="_blank">Knowledge Base</a></li>
                  <li><Link to="/products-catalog">Product Catalog</Link></li>
                  <li><Link to="/profile">My Profile</Link></li></> : '' : ''
              }
              <li className="static"><a href="">Privacy</a></li>
              <li className="static"><a href="">Terms of use</a></li>
              <li className="static">&copy; Copyright 2019 Mount Sinai, all rights reserved.</li>
            </ul>
          </div>
        </div>
      </section>
      {/* <section className="bottom">
          <div className="container d-flex align-items-center">
            <div className="ness-logo">
              <img src={`${iconPath}ness-logo.png`} alt="" className="ness-logo" />
            </div>
            <p>Powered by Ness Digital Engineering</p>
          </div>
        </section> */}
    </div>
  )
}

export default withRouter(Footer);
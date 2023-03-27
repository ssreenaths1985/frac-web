import React from "react";
import { Link } from "react-router-dom";

/**
 * BrandSection renders the logo of the brand
 */

class BrandSection extends React.Component {
  render() {
    return (
      <React.Fragment>
        <nav className="navbar col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 custom-nav-bar brand-section-background">
          {/* Logo and its link */}
          <div
            className="d-flex justify-content-center"
            style={{ width: "inherit" }}
          >
            <Link to="/dashboard">
              <img
                className="img-fluid pointer-style"
                src="../../img/logos/iGOT_logo_light.svg"
                alt="brand"
              />
            </Link>
          </div>
        </nav>
      </React.Fragment>
    );
  }
}

export default BrandSection;

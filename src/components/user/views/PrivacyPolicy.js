import React from "react";
import BrandSection from "../common/BrandSection";
import TopNavBar from "../common/TopNavBar";
import InfoNavBar from "../common/InfoNavBar";

class PrivacyPolicy extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <div className="row">
            <BrandSection />
            <TopNavBar
              pathName={this.props.history.location.pathname}
              history={this.props.history}
            />
            <InfoNavBar history={this.props.history} />
          </div>
        </div>
        <div
          className="col-xs-12 col-sm-12 col-md-12 col-lg-12 custom-padding-1 custom-body-bg custom-full-height-2 custom-full-height-3"
          id="userProfile"
        >
          <center className="mt-5">
            <label>Needs to be constructed</label>
          </center>
        </div>
      </React.Fragment>
    );
  }
}

export default PrivacyPolicy;

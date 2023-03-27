import React from "react";
import BrandSection from "../common/BrandSection";
import TopNavBar from "../common/TopNavBar";
import InfoNavBar from "../common/InfoNavBar";

class UserProfile extends React.Component {
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
          <div className="container pt-5">
            <div className="row mb-3">
              <div className="col-xs-8 col-sm-8 col-md-8 col-lg-8 col-xl-8 p-0">
                <h2>General</h2>
              </div>
              <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                <button type="button" className="btn save-button float-right">
                  Edit
                </button>
              </div>
            </div>
            <div className="row mb-3 custom-margin-2">
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <label>Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Name"
                  aria-label="Name"
                  aria-describedby="basic-name"
                />
              </div>
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <label>Mobile number</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Mobile number"
                  aria-label="phone number"
                  aria-describedby="basic-phone-number"
                />
              </div>
            </div>

            <div className="row mb-5 custom-margin-2">
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <label>Email ID</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Email"
                  aria-label="Email"
                  aria-describedby="basic-addon1"
                />
              </div>
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <label>Password</label>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  aria-label="password"
                  aria-describedby="basic-addon1"
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-xs-8 col-sm-8 col-md-8 col-lg-8 col-xl-8 p-0">
                <h2>Address</h2>
              </div>
              <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                <button type="button" className="btn save-button float-right">
                  Edit
                </button>
              </div>
            </div>
            <div className="row mb-3 custom-margin-2">
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <label>Address line 1</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Address line 1"
                  aria-label="address line 1"
                  aria-describedby="basic-address-1"
                />
              </div>
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <label>Address line 2</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Address line 2"
                  aria-label="address line 2"
                  aria-describedby="basic-address-2"
                />
              </div>
            </div>
            <div className="row mb-3 custom-margin-2">
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <label>State</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="State"
                  aria-label="state"
                  aria-describedby="basic-state"
                />
              </div>
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <label>District</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="District"
                  aria-label="district"
                  aria-describedby="basic-district"
                />
              </div>
            </div>
            <div className="row mb-5 custom-margin-2">
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <label>Postal code</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Pin code"
                  aria-label="pincode"
                  aria-describedby="basic-pincode"
                />
              </div>
            </div>
            <div className="row mb-3">
              <div className="col-xs-8 col-sm-8 col-md-8 col-lg-8 col-xl-8 p-0">
                <h2>Career</h2>
              </div>
              <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4">
                <button type="button" className="btn save-button float-right">
                  Edit
                </button>
              </div>
            </div>
            <div className="row mb-5 custom-margin-2">
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <label>Last Govt. position held</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Last Govt. position held "
                  aria-label="state"
                  aria-describedby="basic-state"
                />
              </div>
              <div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <label>Year of retirement</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Year of retirement"
                  aria-label="Year of retirement"
                  aria-describedby="Year of retirement"
                />
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default UserProfile;

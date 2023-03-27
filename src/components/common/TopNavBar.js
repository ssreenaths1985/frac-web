import React from "react";
import { NavLink } from "react-router-dom";
import { UserService } from "../../services/user.service";
import Notify from "../../helpers/notify";
import CryptoJS from "crypto-js";
import { APP } from "../../constants";
import RoleAuthorization from "./RoleAuthorization";

/**
 * TopNavBar deals with enabling/disabling the navigation menu's and
 * with its related functions
 */

class TopNavBar extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      enableCD: false,
      enableReview: false,
      enableExplore: true,
      currentDept: "",
      wid: "",
    };
    this.getRoles = this.getRoles.bind(this);
    this.encryptUtility = this.encryptUtility.bind(this);
    this.decryptUtility = this.decryptUtility.bind(this);
    this.getWtoken = this.getWtoken.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    setTimeout(() => {
      if (!localStorage.getItem("stateFromNav")) {
        this.getRoles();
      } else {
        this.decryptUtility();
      }
    }, 950);

    if (localStorage.getItem("stateFromNav")) {
      this.decryptUtility();
    }
  }

  // Function to get wtoken for the logged in user from keycloak
  getWtoken = () => {
    setTimeout(() => {
      if (!localStorage.getItem("wid")) {
        this.props.keycloak.loadUserInfo().then((userInfo) => {
          if (userInfo.sub && userInfo.sub.split(":")[2]) {
            let cipherTextWid = CryptoJS.AES.encrypt(
              userInfo.sub.split(":")[2],
              "igotcheckIndia*"
            ).toString();
            localStorage.setItem("wid", cipherTextWid);
          }
        });
      }
    }, 350);
  };

  encryptUtility = (value) => {
    let cipherText = CryptoJS.AES.encrypt(
      JSON.stringify(value),
      "igotcheckIndia*"
    ).toString();
    localStorage.setItem("stateFromNav", cipherText);
  };

  // Function to get user role
  getRoles = () => {
    setTimeout(() => {
      let bytes = CryptoJS.AES.decrypt(
        localStorage.getItem("wid"),
        "igotcheckIndia*"
      );

      if (
        localStorage.getItem("wid") &&
        !localStorage.getItem("stateFromNav")
      ) {
        this.setState(
          {
            wid: bytes.toString(CryptoJS.enc.Utf8),
          },
          () => {
            UserService.getRoles(this.state.wid).then((response) => {
              if (response && response.status === 200) {
                if (
                  response.data.result &&
                  response.data.result.response &&
                  response.data.result.response.roles.includes("FRAC_ADMIN")
                ) {
                  this.setState(
                    {
                      enableCD: true,
                    },
                    () => {
                      this.encryptUtility(response.data);
                    }
                  );
                }
                return null;
              } else {
                Notify.error(response && response.data.statusInfo.errorMessage);
              }
            });
          }
        );
      } else if (
        !localStorage.getItem("wid") &&
        !localStorage.getItem("stateFromNav")
      ) {
        this.getWtoken();
      } else {
        this.decryptUtility();
      }
    }, 950);
  };

  decryptUtility = () => {
    let bytes = CryptoJS.AES.decrypt(
      localStorage.getItem("stateFromNav"),
      "igotcheckIndia*"
    );
    let originalText = bytes.toString(CryptoJS.enc.Utf8);
    if (originalText.includes("FRAC_ADMIN")) {
      this.setState({
        enableCD: true,
      });
    } else if (
      originalText.includes("FRAC_REVIEWER_L1") ||
      originalText.includes("FRAC_REVIEWER_L2")
    ) {
      this.setState({
        enableReview: true,
      });
    } else if (originalText.includes("FRAC_COMPETENCY_MEMBER")) {
      this.setState({
        enableExplore: false,
      });
    } else {
      this.setState({
        enableCD: false,
        enableReview: false,
        enableExplore: true,
      });
    }
  };

  componentWillUnmount() {
    this._isMounted = false;
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    return (
      <React.Fragment>
        <RoleAuthorization
          {...this.props}
          history={this.props.history}
          getRole={this.getCurrentRole}
        />
        <nav className="navbar col-xs-12 col-sm-12 col-md-8 col-lg-7 col-xl-7 custom-nav-bar">
          <div className="row move-left-1">
            {/* Dashboard */}
            <NavLink
              activeClassName=""
              className={`anchor ml-2 pl-4 pr-4 pt-2 pb-2 ${
                this.props.pathName.match("/dashboard") ||
                this.props.pathName === "/"
                  ? "active"
                  : ""
              }`}
              to="/dashboard"
            >
              Dashboard
              <hr
                className={
                  this.props.pathName === "/dashboard" ||
                  this.props.pathName === "/"
                    ? "btmLine"
                    : "btmLineNone"
                }
              />
            </NavLink>

            {/* Explore */}
            {this.state.enableExplore && (
              <NavLink
                activeClassName=""
                className={`anchor pl-4 pr-4 pt-2 pb-2 ${
                  this.props.pathName.match("/explore") ||
                  this.props.pathName.includes("/explore")
                    ? "active"
                    : ""
                }`}
                to="/explore"
              >
                Explore
                <hr
                  className={
                    this.props.pathName === "/explore" ||
                    this.props.pathName.includes("/explore")
                      ? "btmLine"
                      : "btmLineNone"
                  }
                />
              </NavLink>
            )}

            {/* Master List */}
            <NavLink
              activeClassName=""
              className={`anchor pl-4 pr-4 pt-2 pb-2 ${
                this.props.pathName.match("/collection") ||
                this.props.pathName.includes("/collections")
                  ? "active"
                  : ""
              }`}
              to="/collections"
            >
              Collections
              <hr
                className={
                  this.props.pathName === "/collections" ||
                  this.props.pathName.includes("/collections") ||
                  this.props.pathName.match("/collection")
                    ? "btmLine"
                    : "btmLineNone"
                }
              />
            </NavLink>

            {/* Review */}
            {(this.state.enableCD || this.state.enableReview) && (
              <NavLink
                activeClassName=""
                className={`anchor pl-4 pr-4 pt-2 pb-2 ${
                  this.props.pathName.match(APP.ROUTES_PATH.REVIEW) ||
                  this.props.pathName.includes(APP.ROUTES_PATH.REVIEW)
                    ? "active"
                    : ""
                }`}
                to={APP.ROUTES_PATH.REVIEW}
              >
                Review
                <hr
                  className={
                    this.props.pathName === APP.ROUTES_PATH.REVIEW ||
                    this.props.pathName.includes(APP.ROUTES_PATH.REVIEW) ||
                    this.props.pathName.match(APP.ROUTES_PATH.REVIEW)
                      ? "btmLine"
                      : "btmLineNone"
                  }
                />
              </NavLink>
            )}

            {/* Admin */}
            {/* {this.state.enableCD && (
              <NavLink
                activeClassName=""
                className={`anchor pl-4 pr-4 pt-2 pb-2 ${
                  this.props.pathName.match(APP.ROUTES_PATH.ADMIN) ||
                  this.props.pathName.includes(APP.ROUTES_PATH.ADMIN) ||
                  this.props.pathName.includes(APP.WORKFLOWS.DASHBOARD) ||
                  this.props.pathName.match(APP.WORKFLOWS.DETAIL) ||
                  this.props.pathName.match(APP.WORKFLOWS.LEVEL)
                    ? "active"
                    : ""
                }`}
                to={APP.ROUTES_PATH.ADMIN}
              >
                Admin
                <hr
                  className={
                    this.props.pathName === APP.ROUTES_PATH.ADMIN ||
                    this.props.pathName.includes(APP.ROUTES_PATH.ADMIN) ||
                    this.props.pathName.match(APP.ROUTES_PATH.ADMIN) ||
                    this.props.pathName.includes(APP.WORKFLOWS.DASHBOARD) ||
                    this.props.pathName.match(APP.WORKFLOWS.DETAIL) ||
                    this.props.pathName.match(APP.WORKFLOWS.LEVEL)
                      ? "btmLine"
                      : "btmLineNone"
                  }
                />
              </NavLink>
            )} */}
          </div>
        </nav>
      </React.Fragment>
    );
  }
}

export default TopNavBar;

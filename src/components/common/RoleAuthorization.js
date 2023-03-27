import React from "react";
import { ROLES } from "../../helpers/roles";
import Notify from "../../helpers/notify";
import { UserService } from "../../services/user.service";
import { withRouter } from "react-router-dom";
import CryptoJS from "crypto-js";

class RoleAuthorization extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      roles: "",
      currentRole: "",
      currentUserDept: "",
      wid: "",
    };
    this.getUserDetails = this.getUserDetails.bind(this);
    this.encryptUtilityDept = this.encryptUtilityDept.bind(this);
    this.encryptUtilityRoles = this.encryptUtilityRoles.bind(this);
    this.checkAccess = this.checkAccess.bind(this);
    this.decryptUtility = this.decryptUtility.bind(this);
    this.getWtoken = this.getWtoken.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this.getUserDetails();
  }

  encryptUtilityDept = (dept) => {
    let cipherText = CryptoJS.AES.encrypt(dept, "igotcheckIndia*").toString();
    localStorage.setItem("department", cipherText);
    this.decryptUtility();
    this.checkAccess();
  };

  encryptUtilityRoles = (roles) => {
    let cipherText = CryptoJS.AES.encrypt(
      JSON.stringify(roles),
      "igotcheckIndia*"
    ).toString();
    localStorage.setItem("stateFromNav", cipherText);
    this.decryptUtility();
    this.checkAccess();
  };

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
            this.setUserRole();
          }
        });
      }
    }, 350);
  };

  // Function to get user role
  getUserDetails = () => {
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
              if (
                response &&
                response.status === 200 &&
                response.data.result &&
                response.data.result.response &&
                response.data.result.response.roles
              ) {
                this.setState(
                  {
                    roles: response.data.result.response.roles,
                  },
                  () => {
                    this.encryptUtilityRoles(this.state.roles);
                  }
                );
              } else {
                Notify.error(response && response.data.statusInfo.errorMessage);
              }
            });
          }
        );
        UserService.getRoles(bytes.toString(CryptoJS.enc.Utf8)).then(
          (response) => {
            if (
              response &&
              response.status === 200 &&
              response.data.result &&
              response.data.result.response &&
              response.data.result.response.rootOrg &&
              response.data.result.response.rootOrg.orgName
            ) {
              this.setState(
                {
                  currentUserDept:
                    response.data.result.response.rootOrg.orgName,
                },
                () => {
                  this.encryptUtilityDept(
                    response.data.result.response.rootOrg.orgName
                  );
                }
              );
            } else {
              Notify.error(response && response.data.statusInfo.errorMessage);
            }
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
    }, 850);
  };

  setUserRole = () => {
    if (localStorage.getItem("wid")) {
      let bytes = CryptoJS.AES.decrypt(
        localStorage.getItem("wid"),
        "igotcheckIndia*"
      );
      UserService.getRoles(bytes.toString(CryptoJS.enc.Utf8)).then(
        (response) => {
          if (
            response &&
            response.status === 200 &&
            response.data.result &&
            response.data.result.response &&
            response.data.result.response.roles
          ) {
            this.setState(
              {
                roles: response.data.result.response.roles,
              },
              () => {
                this.encryptUtilityRoles(this.state.roles);
              }
            );
          } else {
            Notify.error(response && response.data.statusInfo.errorMessage);
          }
        }
      );
    }
  };

  decryptUtility = () => {
    if (localStorage.getItem("stateFromNav")) {
      let bytes = CryptoJS.AES.decrypt(
        localStorage.getItem("stateFromNav"),
        "igotcheckIndia*"
      );
      let originalText = bytes.toString(CryptoJS.enc.Utf8);

      this.setState(
        {
          roles: originalText,
        },
        () => {
          if (this.state.roles.includes("FRAC_ADMIN")) {
            this.setState(
              {
                currentRole: "FRAC_ADMIN",
              },
              () => {
                this.checkAccess();
              }
            );
          } else if (this.state.roles.includes("FRAC_REVIEWER_L1")) {
            this.setState(
              {
                currentRole: "FRAC_REVIEWER_L1",
              },
              () => {
                this.checkAccess();
              }
            );
          } else if (this.state.roles.includes("FRAC_REVIEWER_L2")) {
            this.setState(
              {
                currentRole: "FRAC_REVIEWER_L2",
              },
              () => {
                this.checkAccess();
              }
            );
          } else if (this.state.roles.includes("FRAC_COMPETENCY_MEMBER")) {
            this.setState(
              {
                currentRole: "FRAC_COMPETENCY_MEMBER",
              },
              () => {
                this.checkAccess();
              }
            );
          } else {
            this.setState(
              {
                currentRole: "IFUUser",
              },
              () => {
                this.checkAccess();
              }
            );
          }
        }
      );
    }
  };

  checkAccess = () => {
    let checkValue =
      this.props.pathName.split("/")[0] +
      "/" +
      this.props.pathName.split("/")[1];
    switch (this.state.currentRole) {
      case "FRAC_ADMIN": {
        if (!ROLES.FRACADMIN.routes.includes(checkValue)) {
          Notify.warning("!Unauthorized access");
          this.props.history.push("/dashboard");
        }
        break;
      }
      case "IFUUser": {
        if (!ROLES.IFUUSER.routes.includes(checkValue)) {
          Notify.warning("!Unauthorized access");
          this.props.history.push("/dashboard");
        }
        break;
      }
      case "FRAC_REVIEWER_L1": {
        if (!ROLES.FRACREVIEWERONE.routes.includes(checkValue)) {
          Notify.warning("!Unauthorized access");
          this.props.history.push("/dashboard");
        }
        break;
      }
      case "FRAC_REVIEWER_L2": {
        if (!ROLES.FRACREVIEWERTWO.routes.includes(checkValue)) {
          Notify.warning("!Unauthorized access");
          this.props.history.push("/dashboard");
        }
        break;
      }
      case "FRAC_COMPETENCY_MEMBER": {
        if (!ROLES.FRACACCESSCOMPETENCY.routes.includes(checkValue)) {
          Notify.warning("!Unauthorized access");
          this.props.history.push("/dashboard");
        }
        break;
      }
      default:
        break;
    }
  };

  componentWillUnmount() {
    this._isMounted = false;
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    return null;
  }
}

export default withRouter(RoleAuthorization);

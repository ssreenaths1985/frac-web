import React from "react";
import BrandSection from "../../common/BrandSection";
import TopNavBar from "../../common/TopNavBar";
import InfoNavBar from "../../common/InfoNavBar";
import DashboardHome from "../views/DashboardHome";
import CryptoJS from "crypto-js";

/**
 * DashboardContainer renders dashboard home components
 */

class DashboardContainer extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      clients: "",
      allSessions: "",
    };
    this.getWtoken = this.getWtoken.bind(this);
    this.receiveClients = this.receiveClients.bind(this);
    this.receiveSessions = this.receiveSessions.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    if (!localStorage.getItem("wid")) {
      this.getWtoken();
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.setState = (state, callback) => {
      return;
    };
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

  receiveClients = (list) => {
    this.setState({
      clients: list,
    });
  };

  receiveSessions = (data) => {
    this.setState({
      allSessions: data
    })
  }

  render() {
    return (
      <React.Fragment>
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          {/* Header Components contains brandlogo, links and userinfo */}
          <div className="row">
            <BrandSection />
            <TopNavBar
              pathName={this.props.history.location.pathname}
              history={this.props.history}
            />
            <InfoNavBar
              history={this.props.history}
              keycloak={this.props.keycloak}
              receiveClients={this.receiveClients}
              receiveSessions={this.receiveSessions}
            />
          </div>
        </div>
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 custom-padding-1">
          {/* Dashboard Component */}
          <DashboardHome
            history={this.props.history}
            clients={this.state.clients}
            allSessions={this.state.allSessions}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default DashboardContainer;

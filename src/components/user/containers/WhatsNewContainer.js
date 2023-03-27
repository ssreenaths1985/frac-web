import React from "react";
import BrandSection from "../../common/BrandSection";
import TopNavBar from "../../common/TopNavBar";
import InfoNavBar from "../../common/InfoNavBar";
import WhatsNewView from "../views/WhatsNewView";

class WhatsNewContainer extends React.Component {
   constructor(props) {
    super(props);
    this.state = {
      clients: "",
    };

    this.receiveClients = this.receiveClients.bind(this);
  }

  receiveClients = (list) => {
    this.setState({
      clients: list,
    });
  };

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
            <InfoNavBar
              history={this.props.history}
              keycloak={this.props.keycloak}
              receiveClients={this.receiveClients}
            />
          </div>
        </div>
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 custom-padding-1">
          <WhatsNewView history={this.props.history} />
        </div>
      </React.Fragment>
    );
  }
}

export default WhatsNewContainer;

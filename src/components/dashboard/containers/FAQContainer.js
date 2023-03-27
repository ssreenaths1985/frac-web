import React from "react";
import BrandSection from "../../common/BrandSection";
import TopNavBar from "../../common/TopNavBar";
import InfoNavBar from "../../common/InfoNavBar";
import FAQView from "../views/FAQView";

class FAQContainer extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      clients: "",
      allSessions: "",
    };
    this.receiveClients = this.receiveClients.bind(this);
    this.receiveSessions = this.receiveSessions.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  receiveClients = (list) => {
    this.setState({
      clients: list,
    });
  };

  receiveSessions = (data) => {
    this.setState({
      allSessions: data,
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
              receiveSessions={this.receiveSessions}
            />
          </div>
        </div>
        <FAQView
          {...this.props}
          history={this.props.history}
          keycloak={this.props.keycloak}
          receiveClients={this.receiveClients}
          receiveSessions={this.receiveSessions}
        />
      </React.Fragment>
    );
  }
}

export default FAQContainer;

import React from "react";
import Router from "./Router";
import Keycloak from "keycloak-js";


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { keycloak: null, authenticated: false };
  }

  componentDidMount() {
    // Keycloak configurations
    const keycloak = Keycloak({
      realm: "sunbird",
      url: window.env.REACT_APP_FRAC_KEYCLOAK_URL,
      clientId: "portal"
    });
    keycloak
      .init({ onLoad: "login-required", checkLoginIframe: false })
      .then(authenticated => {
        this.setState({ keycloak: keycloak, authenticated: authenticated });
      });
  }

  render() {
    if (this.state.keycloak) {
      if (this.state.authenticated)
        return (
          <div>
            <Router keycloak={this.state.keycloak} />
          </div>
        );
      else return <div>Unable to authenticate!</div>;
    }
    return (
      <div className="dropdown-item vertical-center-5">
        Checking authenticity...
      </div>
    );
  }
}

export default App;

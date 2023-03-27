import React from "react";
import { Route } from "react-router-dom";

import { useKeycloak } from "@react-keycloak/web";

export function PrivateRoute({ component: Component, ...rest }) {
  const [keycloak] = useKeycloak();

  if (keycloak) {
    return (
      <Route
        {...rest}
        render={props =>
          keycloak.authenticated && <Component {...props} keycloak={keycloak} />
        }
      />
    );
  } else {
    keycloak.logout();
  }
}

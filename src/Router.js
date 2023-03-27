import React from "react";
import { Switch, BrowserRouter, Route } from "react-router-dom";
import loadable from "@loadable/component";
import { APP } from "./constants";

// Code splitting using loadable components
const DashboardContainer = loadable(() =>
  import("./components/dashboard/containers/DashboardContainer")
);
const ExploreContainer = loadable(() =>
  import("./components/explore/containers/ExploreContainer")
);
const CollectionContainer = loadable(() =>
  import("./components/collections/containers/CollectionContainer")
);
const PositionInfoContainer = loadable(() =>
  import("./components/collections/containers/PositionInfoContainer")
);
const RolesInfoContainer = loadable(() =>
  import("./components/collections/containers/RolesInfoContainer")
);
const ActivitiesInfoContainer = loadable(() =>
  import("./components/collections/containers/ActivitiesInfoContainer")
);
const CompetenciesInfoContainer = loadable(() =>
  import("./components/collections/containers/CompetenciesInfoContainer")
);
const KnowledgeInfoContainer = loadable(() =>
  import("./components/collections/containers/KnowledgeInfoContainer")
);
const ReleaseNotesContainer = loadable(() =>
  import("./components/user/containers/ReleaseNotesContainer")
);
const ReviewContainer = loadable(() =>
  import("./components/review/containers/ReviewContainer")
);
const WhatsNewContainer = loadable(() =>
  import("./components/user/containers/WhatsNewContainer")
);
const AdminContainer = loadable(() =>
  import("./components/admin/containers/AdminContainer")
);
const WorkflowDashboardContainer = loadable(() =>
  import("./components/admin/containers/WorkflowDashboardContainer")
);
const PeopleDashboardContainer = loadable(() =>
  import("./components/admin/containers/PeopleDashboardContainer")
);
const DetailContainer = loadable(() =>
  import("./components/admin/containers/DetailContainer")
);
const LevelContainer = loadable(() =>
  import("./components/admin/containers/LevelContainer")
);
const FAQContainer = loadable(() =>
  import("./components/dashboard/containers/FAQContainer")
);

const bindId = ":id";

/* Router function to enable routing between the various components
 * in the project
 */
const Router = (props) => {
  let keycloak = props.keycloak;
  return (
    <BrowserRouter>
      <Switch>
        <Route
          exact
          path="/"
          component={(props) => (
            <DashboardContainer keycloak={keycloak} {...props} />
          )}
        />
        <Route
          path="/dashboard"
          component={(props) => (
            <DashboardContainer keycloak={keycloak} {...props} />
          )}
        />
        <Route
          path="/explore"
          component={(props) => (
            <ExploreContainer keycloak={keycloak} {...props} />
          )}
        />
        <Route
          path="/collections"
          component={(props) => (
            <CollectionContainer keycloak={keycloak} {...props} />
          )}
        />
        <Route
          path={APP.COLLECTIONS_PATH.POSITION}
          component={(props) => (
            <PositionInfoContainer keycloak={keycloak} {...props} />
          )}
        />
        <Route
          path={APP.COLLECTIONS_PATH.POSITION + bindId}
          component={(props) => (
            <PositionInfoContainer keycloak={keycloak} {...props} />
          )}
        />
        <Route
          path={APP.COLLECTIONS_PATH.ROLE}
          component={(props) => (
            <RolesInfoContainer keycloak={keycloak} {...props} />
          )}
        />
        <Route
          path={APP.COLLECTIONS_PATH.ROLE + bindId}
          component={(props) => (
            <RolesInfoContainer keycloak={keycloak} {...props} />
          )}
        />
        <Route
          path={APP.COLLECTIONS_PATH.ACTIVITY}
          component={(props) => (
            <ActivitiesInfoContainer keycloak={keycloak} {...props} />
          )}
        />
        <Route
          path={APP.COLLECTIONS_PATH.ACTIVITY + bindId}
          component={(props) => (
            <ActivitiesInfoContainer keycloak={keycloak} {...props} />
          )}
        />
        <Route
          path={APP.COLLECTIONS_PATH.COMPETENCY}
          component={(props) => (
            <CompetenciesInfoContainer keycloak={keycloak} {...props} />
          )}
        />
        <Route
          path={APP.COLLECTIONS_PATH.COMPETENCY + bindId}
          component={(props) => (
            <CompetenciesInfoContainer keycloak={keycloak} {...props} />
          )}
        />
        <Route
          path="/collection-knowledge-resources/"
          component={(props) => (
            <KnowledgeInfoContainer keycloak={keycloak} {...props} />
          )}
        />
        <Route
          path="/collection-knowledge-resources/:id"
          component={(props) => (
            <KnowledgeInfoContainer keycloak={keycloak} {...props} />
          )}
        />
        <Route
          path="/release-notes"
          component={(props) => (
            <ReleaseNotesContainer keycloak={keycloak} {...props} />
          )}
        />
        <Route
          path={APP.ROUTES_PATH.REVIEW}
          component={(props) => (
            <ReviewContainer keycloak={keycloak} {...props} />
          )}
        />
        <Route
          path="/walkthrough"
          component={(props) => (
            <WhatsNewContainer keycloak={keycloak} {...props} />
          )}
        />
        <Route
          path={APP.ROUTES_PATH.ADMIN}
          component={(props) => (
            <AdminContainer keycloak={keycloak} {...props} />
          )}
        />
        <Route
          path={APP.WORKFLOWS.DASHBOARD}
          component={(props) => (
            <WorkflowDashboardContainer keycloak={keycloak} {...props} />
          )}
        />
        <Route
          path={APP.WORKFLOWS.PEOPLE}
          component={(props) => (
            <PeopleDashboardContainer keycloak={keycloak} {...props} />
          )}
        />
        <Route
          path={APP.WORKFLOWS.DETAIL}
          component={(props) => (
            <DetailContainer keycloak={keycloak} {...props} />
          )}
        />
        <Route
          path={APP.WORKFLOWS.DETAIL + "/:id"}
          component={(props) => (
            <DetailContainer keycloak={keycloak} {...props} />
          )}
        />
        <Route
          path={APP.WORKFLOWS.LEVEL + "/:type/:id"}
          component={(props) => (
            <LevelContainer keycloak={keycloak} {...props} />
          )}
        />
         <Route
          path={"/faq"}
          component={(props) => (
            <FAQContainer keycloak={keycloak} {...props} />
          )}
        />
      </Switch>
    </BrowserRouter>
  );
};

export default Router;

import React from "react";
import ColumnOne from "../views/ColumnOne";
import ColumnTwo from "../views/ColumnTwo";
import HeaderSection from "../../collections/containers/common/HeaderSection";
import ColumnThree from "../views/ColumnThree";

class DetailContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      currentDept: "",
      clients: "",
      gotData: "",
      sendData: "",
      roomId: "",
      allSessions: "",
    };
    this.getCurrentDept = this.getCurrentDept.bind(this);
    this.getClients = this.getClients.bind(this);
    this.gotMessage = this.gotMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.getRoomId = this.getRoomId.bind(this);
    this.getSessions = this.getSessions.bind(this);
  }

  componentDidMount() {
    const allowedActivitiesPath = [
      "/workflow-detail/activities",
      "/workflow-detail/overview-activities",
    ];
    const allowedPositionsPath = [
      "/workflow-detail/positions",
      "/workflow-detail/overview-positions",
    ];
    const allowedRolesPath = [
      "/workflow-detail/roles",
      "/workflow-detail/overview-roles",
    ];
    const allowedCompetenciesPath = [
      "/workflow-detail/competencies",
      "/workflow-detail/overview-competencies",
    ];

    if (this.props && this.props.location) {
      if (this.props.location.pathname) {
        if (allowedActivitiesPath.includes(this.props.location.pathname)) {
          this.setState({
            title: "Activities",
          });
        }

        if (allowedPositionsPath.includes(this.props.location.pathname)) {
          this.setState({
            title: "Positions",
          });
        }

        if (allowedRolesPath.includes(this.props.location.pathname)) {
          this.setState({
            title: "Roles",
          });
        }

        if (allowedCompetenciesPath.includes(this.props.location.pathname)) {
          this.setState({
            title: "Competencies",
          });
        }
      }
    }
  }

  getCurrentDept = (value) => {
    this.setState({
      currentDept: value,
    });
  };

  getClients = (list) => {
    this.setState({
      clients: list,
    });
  };

  gotMessage = (data) => {
    this.setState({
      gotData: data,
    });
  };

  sendMessage = (data) => {
    this.setState({
      sendData: data,
    });
  };

  getRoomId = (value) => {
    this.setState({
      roomId: value,
    });
  };

  getSessions = (data) => {
    this.setState({
      allSessions: data,
    });
  };

  getRowSelection = (value) => {
    console.log(value);
  };

  render() {
    return (
      <React.Fragment>
        <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12">
          <HeaderSection
            {...this.props}
            getClients={this.getClients}
            gotData={this.gotMessage}
            sendData={this.state.sendData}
            sendRoomId={this.state.roomId}
            getSessions={this.getSessions}
          />
        </div>

        <div className="d-xl-flex d-lg-flex d-md-flex d-sm-none col-xs-12 col-sm-12 col-md-12 col-lg-12 custom-padding-1">
          <ColumnOne
            {...this.props}
            history={this.props.history}
            getDeptValue={(value) => this.getCurrentDept(value)}
            clients={this.state.clients}
            getRoomId={this.getRoomId}
            allSessions={this.state.allSessions}
          />
          <ColumnTwo
            {...this.props}
            title={this.state.title}
            getRowSelection={this.getRowSelection}
          />

          {this.props &&
            this.props.location &&
            this.props.location.pathname &&
            this.props.location.pathname.match("/overview-") && (
              <ColumnThree {...this.props} title={this.state.title} />
            )}
        </div>
      </React.Fragment>
    );
  }
}

export default DetailContainer;

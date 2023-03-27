import React from "react";
import ColumnOne from "../views/ColumnOne";
import HeaderSection from "../../collections/containers/common/HeaderSection";

class PeopleDashboardContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
          <div className="col-xs-12 col-sm-12 col-md-10 col-lg-10 col-xl-10 bordered custom-full-height-4 custom-body-bg">
            <div className="vertical-center d-none d-sm-block" id="emptyState">
              <center>
                <h1 className="pb-2">Under construction!</h1>
              </center>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default PeopleDashboardContainer;

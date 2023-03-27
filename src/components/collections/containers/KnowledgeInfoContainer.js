import React from "react";
import ColumnOne from "../views/positions/ColumnOne";
import ColumnTwo from "../views/knowledgeResources/ColumnTwo";
import ColumnThree from "../views/knowledgeResources/ColumnThree";
import HeaderSection from "./common/HeaderSection";

class KnowledgeInfoContainer extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      krCurrentDept: "",
      clients: "",
      gotData: "",
      sendData: "",
      roomId: "",
      allSessions: "",
    };
    this.getKrCurrentDept = this.getKrCurrentDept.bind(this);
    this.getClients = this.getClients.bind(this);
    this.gotMessage = this.gotMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.getRoomId = this.getRoomId.bind(this);
    this.getSessions = this.getSessions.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.setState = (state, callback) => {
      return;
    };
  }

  getKrCurrentDept = (value) => {
    this.setState({
      krCurrentDept: value,
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
            getDeptValue={(value) => this.getKrCurrentDept(value)}
            clients={this.state.clients}
            getRoomId={this.getRoomId}
            allSessions={this.state.allSessions}
          />
          <ColumnTwo
            {...this.props}
            department={this.state.krCurrentDept}
            clients={this.state.clients}
            getRoomId={this.getRoomId}
            allSessions={this.state.allSessions}
          />
          {this.props.history.location.state &&
            (this.props.history.location.state.showColumnThree ||
              this.props.history.location.pathname.includes("0")) && (
              <ColumnThree
                {...this.props}
                department={this.state.krCurrentDept}
                clients={this.state.clients}
                getMessage={this.state.gotData}
                sendMessage={this.sendMessage}
                allSessions={this.state.allSessions}
              />
            )}
          {(!this.props.history.location.state ||
            (this.props.history.location.state &&
              !this.props.history.location.state.stayOn &&
              !this.props.history.location.state.showColumnThree &&
              this.props.history.location.pathname ===
                "/collection-knowledge-resources/") ||
            this.props.history.location.state.deleteItem) && (
            <div className="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 bordered custom-full-height-4 custom-body-bg">
              <div
                className="vertical-center d-none d-sm-block"
                id="emptyState"
              >
                <center>
                  <h1 className="pb-2">No knowledge resource selected</h1>
                  <p className="col-7 pb-2">
                    Please select a knowledge resource from the list to see its
                    details here
                  </p>
                  <img
                    src="../../img/empty/knowledge_resource_empty.svg"
                    alt="empty knowledge/resource"
                  ></img>
                </center>
              </div>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default KnowledgeInfoContainer;

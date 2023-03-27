import React from "react";
import ColumnOne from "../views/ColumnOne";
import ColumnTwo from "../views/ColumnTwo";
import HeaderSection from "../../collections/containers/common/HeaderSection";
import LevelUnFilledView from "../views/LevelUnFilledView";
import LevelFilledView from "../views/LevelFilledView";

class LevelContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "",
      id: "",
      currentDept: "",
      clients: "",
      gotData: "",
      sendData: "",
      roomId: "",
      allSessions: "",
      formFilled: false,
    };
    this.getCurrentDept = this.getCurrentDept.bind(this);
    this.getClients = this.getClients.bind(this);
    this.gotMessage = this.gotMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.getRoomId = this.getRoomId.bind(this);
    this.getSessions = this.getSessions.bind(this);
    this.getFilledState = this.getFilledState.bind(this);
  }

  componentDidMount() {
    if (this.props && this.props.location) {
      if (
        (this.props.location.state &&
          this.props.location.state.type === "POSITION") ||
        (this.props.match &&
          this.props.match.params &&
          this.props.match.params.type === "positions")
      ) {
        this.setState({
          title: "Positions",
          id: this.props.match.params.id || this.props.location.state.id,
          type: "POSITION",
        });
      }

      if (
        (this.props.location.state &&
          this.props.location.state.type === "ACTIVITY") ||
        (this.props.match &&
          this.props.match.params &&
          this.props.match.params.type === "activities")
      ) {
        this.setState({
          title: "Activities",
          id: this.props.match.params.id || this.props.location.state.id,
          type: "ACTIVITY",
        });
      }

      if (
        (this.props.location.state &&
          this.props.location.state.type === "ROLE") ||
        (this.props.match &&
          this.props.match.params &&
          this.props.match.params.type === "roles")
      ) {
        this.setState({
          title: "Roles",
          id: this.props.match.params.id || this.props.location.state.id,
          type: "ROLE",
        });
      }

      if (
        (this.props.location.state &&
          this.props.location.state.type === "COMPETENCY") ||
        (this.props.match &&
          this.props.match.params &&
          this.props.match.params.type === "competencies")
      ) {
        this.setState({
          title: "Competencies",
          id: this.props.match.params.id || this.props.location.state.id,
          type: "COMPETENCY",
        });
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

  getFilledState = (value) => {
    this.setState({
      formFilled: value,
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.id === "" &&
      this.state.id &&
      this.state.id > 0 &&
      this.state.title
    ) {
      this.setState({
        formFilled: true,
      });
    }
  }

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
            id={this.state.id}
            type={this.state.type}
            getRowSelection={this.getRowSelection}
          />

          {this.state.formFilled ? (
            <LevelFilledView
              {...this.props}
              getFilledState={this.getFilledState}
              title={this.state.title}
            />
          ) : (
            <LevelUnFilledView
              {...this.props}
              getFilledState={this.getFilledState}
              title={this.state.title}
            />
          )}
        </div>
      </React.Fragment>
    );
  }
}

export default LevelContainer;

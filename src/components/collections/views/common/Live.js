import React from "react";
import moment from "moment";
import "moment-timezone";
import { UserService } from "../../../../services/user.service";
import { SocketService } from "../../../../services/socket.service";
import { APP } from "../../../../constants/appConstants";
import randomColor from "randomcolor";
import CryptoJS from "crypto-js";

/**
 * Components display the live details
 */

class Live extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      allSessions: "",
      crSession: "",
      curatedSessions: [],
      clientsArray: [],
      msgValue: "",
      messages: [],
      dynamicRoom: "",
      currentUsers: [],
      msgFromApi: [],
    };
    this.avatarGenerator = this.avatarGenerator.bind(this);
    this.getAllSessionDetails = this.getAllSessionDetails.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.curateMessage = this.curateMessage.bind(this);
    this.updateSessionDetails = this.updateSessionDetails.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    this.getAllSessionDetails();

    if (this.props && this.props.clients && this.props.clients.length > 0) {
      let data = this.props.clients.split(",");
      this.setState({
        clientsArray: data,
      });
    }

    if (localStorage.getItem("sessionId")) {
      let deciphered = CryptoJS.AES.decrypt(
        localStorage.getItem("sessionId"),
        "igotcheckIndia*"
      );
      let originalText = deciphered.toString(CryptoJS.enc.Utf8);

      this.setState(
        {
          crSession: originalText,
        },
        () => {
          let cipherSession = CryptoJS.AES.encrypt(
            this.state.crSession,
            "igotcheckIndia*"
          ).toString();
          localStorage.setItem("sessionId", cipherSession);
        }
      );
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  getAllSessionDetails = () => {
    SocketService.getAllSessions().then((response) => {
      if (response.status === APP.CODE.SUCCESS) {
        if (response.data.length > 0) {
          this.setState(
            {
              allSessions: response.data,
            },
            () => {
              this.state.allSessions.map((i, j) => {
                let data = {
                  name: i.name,
                  avatar: this.avatarGenerator(i.name),
                  color: randomColor({ luminosity: "dark" }),
                  room: i.room,
                };

                this.setState(
                  (prevState) => ({
                    curatedSessions: [...prevState.curatedSessions, data],
                  }),
                  () => {
                    let filteredArray = this.state.curatedSessions.filter(
                      (v, i, a) =>
                        a.findIndex(
                          (t) => t.room === v.room && t.name === v.name
                        ) === i
                    );
                    this.setState(
                      {
                        curatedSessions: filteredArray,
                      },
                      () => {
                        let currentUserData = [];
                        this.state.curatedSessions.map((i, j) => {
                          if (
                            i.room === (this.props.location.state.id || "0")
                          ) {
                            currentUserData.push(i);
                            this.setState({
                              currentUsers: currentUserData,
                            });
                          } else {
                            // this.setState({
                            //   currentUsers: [],
                            // });
                          }
                          return null;
                        });
                      }
                    );
                  }
                );
                return null;
              });
            }
          );
        } else {
          setTimeout(() => {
            this.props.history.push("/dashboard");
            UserService.logout();
            this.props.keycloak.logout();
          }, 800);
        }
      }
    });
  };

  updateSessionDetails = (data) => {
    this.setState(
      {
        allSessions: data,
      },
      () => {
        this.state.allSessions.map((i, j) => {
          let data = {
            name: i.name,
            avatar: this.avatarGenerator(i.name),
            color: randomColor({ luminosity: "dark" }),
            room: i.room,
          };

          this.setState(
            {
              curatedSessions: [],
            },
            () => {
              this.setState(
                (prevState) => ({
                  curatedSessions: [...prevState.curatedSessions, data],
                }),
                () => {
                  let filteredArray = this.state.curatedSessions.filter(
                    (v, i, a) =>
                      a.findIndex(
                        (t) => t.room === v.room && t.name === v.name
                      ) === i
                  );
                  this.setState(
                    {
                      curatedSessions: filteredArray,
                    },
                    () => {
                      let currentUserData = [];
                      this.state.curatedSessions.map((i, j) => {
                        if (i.room === (this.props.location.state.id || "0")) {
                          currentUserData.push(i);
                          this.setState({
                            currentUsers: currentUserData,
                          });
                        } else {
                          // this.setState({
                          //   currentUsers: [],
                          // });
                        }
                        return null;
                      });
                    }
                  );
                }
              );
            }
          );

          return null;
        });
      }
    );
  };

  avatarGenerator = (value) => {
    if (value) {
      let generatedString = value
        .split(/\s/)
        .reduce((res, letter) => (res += letter.slice(0, 1)), "");
      return generatedString;
    }
  };

  formatDate = (value) => {
    let fmt = "hh:mm A";
    let formatedDateTime = moment.utc(value);
    let localTimeZone = moment.tz.guess();
    return formatedDateTime.tz(localTimeZone).format(fmt);
  };

  sendMessage = () => {
    if (localStorage.getItem("sessionId") && this.state.msgValue) {
      let originalText;
      if (!this.state.crSession) {
        let deciphered = CryptoJS.AES.decrypt(
          localStorage.getItem("sessionId"),
          "igotcheckIndia*"
        );
        originalText = deciphered.toString(CryptoJS.enc.Utf8);

        this.setState({
          crSession: originalText,
        });
      } else {
        originalText = this.state.crSession;
      }

      let data;

      this.state.allSessions.map((f, g) => {
        let arry = JSON.stringify(f.sid);

        if (arry.includes(originalText)) {
          data = {
            name: f.name,
            message: this.state.msgValue,
            sessionId: originalText,
            roomId: this.props.location.state.id,
            time: Date.now(),
          };
          return data;
        } else {
          SocketService.getAllSessions().then((response) => {
            if (response.status === APP.CODE.SUCCESS) {
              if (response.data.length > 0) {
                this.setState(
                  {
                    allSessions: response.data,
                  },
                  () => {
                    this.state.allSessions.map((g, h) => {
                      arry = JSON.stringify(g.sid);
                      if (arry.includes(originalText)) {
                        data = {
                          name: f.name,
                          message: this.state.msgValue,
                          sessionId: originalText,
                          roomId: this.props.location.state.id,
                          time: Date.now(),
                        };
                        return data;
                      }
                      return null;
                    });
                  }
                );
              }
            }
          });
        }
        return null;
      });

      setTimeout(() => {
        if (localStorage.getItem("data")) {
          this.setState(
            (prevState) => ({
              messages: [...prevState.messages, localStorage.getItem("data")],
            }),
            () => {
              this.setState(
                (prevState) => ({
                  messages: [...prevState.messages.messages],
                }),
                () => {
                  this.props.sendMessage(data);
                  this.setState({
                    msgValue: "",
                  });
                }
              );
            }
          );
        } else {
          this.setState(
            (prevState) => ({
              messages: [...prevState.messages, data],
            }),
            () => {
              this.props.sendMessage(data);
              this.setState({
                msgValue: "",
              });
            }
          );
        }
        var element = document.getElementById("messageArea");
        element.scrollTop = element.scrollHeight - element.clientHeight;
        localStorage.setItem("messageData", JSON.stringify(data));
      }, 250);
    }
  };

  curateMessage = (data) => {
    this.setState(
      (prevState) => ({
        messages: [...prevState.messages, data],
      }),
      () => {
        var element = document.getElementById("messageArea");
        element.scrollTop = element.scrollHeight - element.clientHeight;
      }
    );
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.allSessions !== prevProps.allSessions) {
      this.updateSessionDetails(this.props.allSessions);
    }

    if (
      this.props.clients !== undefined &&
      prevProps.clients !== undefined &&
      this.props.clients !== prevProps.clients
    ) {
      this.setState(
        {
          curatedSessions: [],
        },
        () => {
          setTimeout(() => {
            this.getAllSessionDetails();
          }, 850);
        }
      );
    } else if (this.props.clients !== prevProps.clients) {
      this.setState(
        {
          curatedSessions: [],
        },
        () => {
          setTimeout(() => {
            this.getAllSessionDetails();
          }, 850);
        }
      );
    }

    if (prevProps.getMessage !== this.props.getMessage) {
      this.curateMessage(this.props.getMessage);
    }

    if (
      this.props.location &&
      prevProps.location &&
      this.props.location.state &&
      prevProps.location.state
    ) {
      if (this.props.location.state.id !== prevProps.location.state.id) {
        this.setState(
          {
            curatedSessions: [],
          },
          () => {
            setTimeout(() => {
              this.getAllSessionDetails();
            }, 850);
          }
        );
      }
    }
  }

  handleKeyPress = (event) => {
    if (event.key && event.key === "Enter") {
      this.sendMessage();
    }
  };

  render() {
    return (
      <React.Fragment>
        <div className="">
          {!this.state.currentUsers.length && (
            <p className="pt-3">Currently no collaborators found!</p>
          )}
          <div className="d-flex flex-row live-status-row-1">
            {this.state.currentUsers.length &&
              this.state.currentUsers.map((k, l) => {
                if (
                  k.room === (this.props.location.state.id || "0") &&
                  l <= 2
                ) {
                  return (
                    <React.Fragment key={l}>
                      <div
                        className="profile-circle-live pointer-style"
                        style={{ background: k.color }}
                        data-toggle="tooltip"
                        data-placement="top"
                        title={k.name}
                      >
                        {k.avatar}
                      </div>
                    </React.Fragment>
                  );
                }
                return null;
              })}
            {this.state.currentUsers.length &&
              this.state.currentUsers.length > 3 &&
              this.state.currentUsers.map((i, j) => {
                if (
                  i.room === (this.props.location.state.id || "0") &&
                  j === 3
                ) {
                  return (
                    <div
                      className="profile-circle-live pointer-style more-users"
                      data-placement="top"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                      title={"+" + (this.state.currentUsers.length - 3)}
                    >
                      {"+" + (this.state.currentUsers.length - 3)}
                    </div>
                  );
                }
                return null;
              })}
            {this.state.currentUsers.length &&
              this.state.currentUsers.length >= 3 && (
                <div class="dropdown-menu" aria-labelledby="usersListDropdown">
                  {this.state.currentUsers.length > 0 &&
                    this.state.currentUsers.length >= 3 &&
                    this.state.currentUsers.map((i, j) => {
                      if (
                        i.room === (this.props.location.state.id || "0") &&
                        j >= 3
                      ) {
                        return (
                          <div className="dropdown-item" title={i.name} key={j}>
                            <div className="row">
                              <p className="pt-1 pr-3 pb-1">{i.name}</p>
                              <div
                                className="profile-circle-live pointer-style"
                                style={{ background: i.color, color: "white" }}
                                data-toggle="tooltip"
                                data-placement="top"
                              >
                                {i.avatar}
                              </div>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    })}
                </div>
              )}
          </div>
        </div>
        <div>
          <div id="messageArea" className="mt-2">
            {this.state.messages &&
              this.state.messages.map((n, m) => {
                if (
                  this.state.crSession &&
                  n &&
                  this.state.crSession === n.sessionId
                ) {
                  if (n.roomId === this.props.location.state.id) {
                    return (
                      <div className="mt-3" key={m}>
                        <div className="chat-message-1 p-3">
                          <div className="d-flex flex-row justify-content-between">
                            <h4>You</h4>
                            <label>{this.formatDate(n.time)}</label>
                          </div>

                          <h5>{n.message}</h5>
                        </div>
                      </div>
                    );
                  }
                } else {
                  if (n && n.roomId === this.props.location.state.id) {
                    return (
                      <div className={`${m === 0 ? "mt-3" : "mt-2"}`} key={m}>
                        <div className="chat-message-2 p-3">
                          <div className="d-flex flex-row justify-content-between">
                            <h4 className="w-50">{n.name}</h4>
                            <label>{this.formatDate(n.time)}</label>
                          </div>

                          <h5>{n.message}</h5>
                        </div>
                      </div>
                    );
                  }
                }
                return null;
              })}
          </div>
          <div
            className="col-12 chat-container push-bottom-2 p-0"
            id="chatArea"
          >
            {this.state.currentUsers.length >= 2 && (
              <>
                <input
                  id="chat-box-1"
                  className="mr-3 pl-2"
                  placeholder="Type here to chat"
                  onChange={(event) =>
                    this.setState({
                      msgValue: event.target.value,
                    })
                  }
                  onKeyPress={this.handleKeyPress}
                  value={this.state.msgValue}
                  autoComplete="off"
                />
                <button
                  type="button"
                  tabIndex="0"
                  className="btn chat-send-btn chat-send-icon"
                  onClick={() => this.sendMessage()}
                ></button>
              </>
            )}
            {this.state.currentUsers.length < 2 && (
              <>
                <input
                  id="chat-box-1"
                  className="mr-3 pl-2"
                  placeholder="Type here to chat"
                  onChange={(event) =>
                    this.setState({
                      msgValue: event.target.value,
                    })
                  }
                  value={this.state.msgValue}
                  autoComplete="off"
                  disabled
                />
                <button
                  type="button"
                  tabIndex="0"
                  className="btn chat-send-btn chat-send-icon"
                  onClick={() => this.sendMessage()}
                  disabled
                ></button>
              </>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Live;

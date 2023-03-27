import React from "react";
import { UserService } from "../../services/user.service";
import { SocketService } from "../../services/socket.service";
import CryptoJS from "crypto-js";
import Notify from "../../helpers/notify";
import { io } from "socket.io-client";

const socket = io(window.env.REACT_APP_FRAC_SOCKET_URL, {
  path: "/socket.io/",
  reconnect: true,
  transports: ["websocket"],
});

/**
 * InfoNavBar renders with user info and
 * with other non-core features of the application
 */

class InfoNavBar extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      genAvatar: "",
      currentUser: "",
      firstName: "",
      counter: 0,
      isConnected: socket.connected,
      sessionId: socket.id,
      userData: "",
      allSessions: "",
      wid: "",
      incomingMsg: "",
      outgoingMsg: "",
      updateRoomId: "",
      room: "defaultRoom",
      clientArray: [],
    };

    this.nameAvatar = this.nameAvatar.bind(this);
    this.logout = this.logout.bind(this);
    this.encryptUtility = this.encryptUtility.bind(this);
    this.decryptFirstName = this.decryptFirstName.bind(this);
    this.decryptUser = this.decryptUser.bind(this);
    this.postSessionDetails = this.postSessionDetails.bind(this);
    this.socketConfigurations = this.socketConfigurations.bind(this);
    this.terminateSession = this.terminateSession.bind(this);
    this.socketDisconnection = this.socketDisconnection.bind(this);
    this.getMessage = this.getMessage.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.rePostSession = this.rePostSession.bind(this);
    this.updateRoom = this.updateRoom.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
    localStorage.setItem("user", this.props.keycloak.token);

    setTimeout(() => {
      if (!localStorage.getItem("stateFromNav")) {
        Notify.info("!Sorry, Unauthorized access hence logging out");
        setTimeout(() => {
          this.logout();
        });
      }
    }, 3000);

    this.socketConfigurations();
    this.encryptUtility();
  }

  socketConfigurations = () => {
    socket.on("connect", () => {
      this.setState({
        isConnected: true,
      });
      this.setState(
        {
          sessionId: socket.id,
        },
        () => {
          let cipherSession = CryptoJS.AES.encrypt(
            this.state.sessionId,
            "igotcheckIndia*"
          ).toString();
          localStorage.setItem("sessionId", cipherSession);
        }
      );

      socket.emit("fracRooms", this.state.room, "defaultRoom");
    });

    socket.on("disconnect", () => {
      this.setState({
        isConnected: false,
      });
      socket.removeAllListeners();
    });

    socket.on("clientsList", (data) => {
      if (this.props.receiveClients) {
        this.props.receiveClients(data);
        this.setState({
          clientArray: data,
        });
        if (this.state.allSessions.length === 0) {
          setTimeout(() => {
            if (data.length === 0) {
              SocketService.getAllSessions().then((res) => {
                if (res.data.length === 0) {
                  if (this.state.userData.length === 0) {
                    this.rePostSession(data);
                  } else {
                    this.terminateSession();
                  }
                } else {
                  if (!this.state.allSessions && data.length !== 0) {
                    if (
                      res.data.length !== data.split(",").length ||
                      data.length === 0
                    ) {
                      setTimeout(() => {
                        if (this.state.userData.length === 0) {
                          this.props.keycloak
                            .loadUserInfo()
                            .then((userInfo) => {
                              this.setState(
                                {
                                  userData: userInfo,
                                },
                                () => {
                                  SocketService.addUpdateSession(
                                    this.state.sessionId,
                                    userInfo.name,
                                    userInfo.email,
                                    userInfo.sub.split(":")[2]
                                  ).then((response) => {
                                    if (response && response.status === 200) {
                                      SocketService.getAllSessions().then(
                                        (res) => {
                                          this.setState(
                                            {
                                              allSessions: res.data,
                                            },
                                            () => {
                                              this.props.receiveClients(data);
                                            }
                                          );
                                        }
                                      );
                                    }
                                  });
                                }
                              );
                            });
                        }
                      }, 1500);
                    }
                  }
                }
              });
            }
          }, 2000);
        } else {
          if (this.state.allSessions.length !== data.split(",").length) {
            setTimeout(() => {
              SocketService.getAllSessions().then((res) => {
                this.setState(
                  {
                    allSessions: res.data,
                  },
                  () => {
                    this.props.receiveClients(data);
                  }
                );
              }, 500);
            });
          }
        }
      }
    });

    socket.on("fracSendMessageToAll", (data) => {
      this.sendMessage(data);
    });

    socket.on("allSessionList", (data) => {
      if (this.props.receiveSessions) {
        this.props.receiveSessions(data);
      }
    });

    socket.on("updateRoom", (data) => {
      if (!this.state.room) {
        this.setState(
          {
            room: data,
          },
          () => {
            this.rePostSession(this.state.clientArray);
          }
        );
      }
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("clientsList");
      socket.off("fracSendMessageToAll");
      socket.off("updateRoom");
    };
  };

  encryptUtility = () => {
    if (
      !localStorage.getItem("currentUser ") &&
      !localStorage.getItem("firstName")
    ) {
      this.props.keycloak.loadUserInfo().then((userInfo) => {
        let name = userInfo.preferred_username.split("@")[0];

        if (userInfo.sub && userInfo.sub.split(":")[2]) {
          let cipherTextWid = CryptoJS.AES.encrypt(
            userInfo.sub.split(":")[2],
            "igotcheckIndia*"
          ).toString();
          localStorage.setItem("wid", cipherTextWid);
        }
        if (this.state.userData.length === 0 && this.state.isConnected) {
          this.setState(
            {
              userData: userInfo,
            },
            () => {
              this.postSessionDetails();
            }
          );
        } else {
          if (this.state.userData.length > 0) {
            this.rePostSession(this.state.clientArray);
          }
        }

        let cipherText1 = CryptoJS.AES.encrypt(
          name,
          "igotcheckIndia*"
        ).toString();
        localStorage.setItem("currentUser", cipherText1);
        let cipherText2 = CryptoJS.AES.encrypt(
          userInfo.given_name,
          "igotcheckIndia*"
        ).toString();
        localStorage.setItem("firstName", cipherText2);
        this.decryptFirstName();
        this.decryptUser();
      });
    } else {
      if (
        localStorage.getItem("currentUser") &&
        localStorage.getItem("firstName")
      ) {
        this.decryptFirstName();
        this.decryptUser();
        if (!this.state.userData) {
          this.props.keycloak.loadUserInfo().then((userInfo) => {
            this.setState(
              {
                userData: userInfo,
              },
              () => {
                this.rePostSession(this.state.clientArray);
              }
            );
          });
        }
      }
    }
  };

  decryptFirstName = () => {
    let bytes = CryptoJS.AES.decrypt(
      localStorage.getItem("firstName"),
      "igotcheckIndia*"
    );
    let decryptedFirstName = bytes.toString(CryptoJS.enc.Utf8);
    this.setState({
      firstName: decryptedFirstName,
    });
  };

  decryptUser = () => {
    let bytes = CryptoJS.AES.decrypt(
      localStorage.getItem("currentUser"),
      "igotcheckIndia*"
    );
    let decryptedCurrentUser = bytes.toString(CryptoJS.enc.Utf8);
    this.setState(
      {
        currentUser: decryptedCurrentUser,
      },
      () => {
        this.nameAvatar();
      }
    );
  };

  nameAvatar = () => {
    let genAvat = this.state.currentUser
      .split(/\s/)
      .reduce((res, letter) => (res += letter.slice(0, 1)), "");
    this.setState({
      genAvatar: genAvat,
    });
  };

  logout = () => {
    this.terminateSession();
  };

  postSessionDetails = () => {
    let wId = this.state.userData.sub.split(":")[2];
    let username = this.state.userData.name;
    let email = this.state.userData.email;

    SocketService.addUpdateSession(
      this.state.sessionId,
      username,
      email,
      wId,
      this.state.room
    ).then((response) => {
      if (response && response.status === 200) {
        setTimeout(() => {
          SocketService.getAllSessions().then((res) => {
            this.setState(
              {
                allSessions: res.data,
              },
              () => {
                this.props.receiveClients(this.state.clientArray);
                socket.emit("allSessionList", this.state.allSessions);
              }
            );
          });
        }, 500);
      }
    });
  };

  rePostSession = (data) => {
    let msgData;

    if (
      this.state.room === this.state.outgoingMsg.roomId &&
      this.state.incomingMsg !== this.state.outgoingMsg
    ) {
      msgData = this.state.outgoingMsg;
    } else if (
      this.state.room === this.state.incomingMsg.roomId &&
      this.state.incomingMsg !== this.state.outgoingMsg
    ) {
      msgData = this.state.incomingMsg;
    } else {
      msgData = "";
    }

    this.props.keycloak.loadUserInfo().then((userInfo) => {
      SocketService.addUpdateSession(
        this.state.sessionId,
        userInfo.name,
        userInfo.email,
        userInfo.sub.split(":")[2],
        this.state.room,
        msgData
      ).then((response) => {
        if (response && response.status === 200) {
          setTimeout(() => {
            SocketService.getAllSessions().then((res) => {
              this.setState(
                {
                  allSessions: res.data,
                },
                () => {
                  this.props.receiveClients(data);
                  this.props.receiveSessions &&
                    this.props.receiveSessions(this.state.allSessions);
                  socket.emit("allSessionList", this.state.allSessions);
                }
              );
            });
          }, 500);
        }
      });
    });
  };

  terminateSession = () => {
    if (this.state.userData.length > 0) {
      let wId = this.state.userData.sub.split(":")[2];
      this.socketDisconnection(wId);
    } else {
      this.props.keycloak.loadUserInfo().then((userDetails) => {
        this.setState(
          {
            userData: userDetails,
          },
          () => {
            let wId = this.state.userData.sub.split(":")[2];
            this.socketDisconnection(wId);
          }
        );
      });
    }
  };

  socketDisconnection = (wId) => {
    if (this.state.allSessions) {
      this.state.allSessions.map((i, j) => {
        if (i.userid === wId) {
          SocketService.deleteSession(i._id).then((response) => {
            if (response) {
              socket.disconnect();
              this.setState(
                {
                  isConnected: false,
                },
                () => {
                  this.props.history.push("/dashboard");

                  setTimeout(() => {
                    this.props.keycloak.logout();
                    UserService.logout();
                  }, 500);
                }
              );
            } else {
              this.props.history.push("/dashboard");

              setTimeout(() => {
                this.props.keycloak.logout();
                UserService.logout();
              }, 500);
            }
          });
        }
        return null;
      });
    } else {
      SocketService.getAllSessions().then((res) => {
        if (res !== undefined && res.data.length !== 0) {
          res.data.map((o, p) => {
            if (o.userid === wId) {
              SocketService.deleteSession(o._id).then((response) => {
                if (response) {
                  socket.disconnect();
                  this.setState(
                    {
                      isConnected: false,
                    },
                    () => {
                      this.props.history.push("/dashboard");

                      setTimeout(() => {
                        this.props.keycloak.logout();
                        UserService.logout();
                      }, 500);
                    }
                  );
                } else {
                  this.props.history.push("/dashboard");

                  setTimeout(() => {
                    this.props.keycloak.logout();
                    UserService.logout();
                  }, 500);
                }
              });
            }
            return null;
          });
        } else {
          setTimeout(() => {
            this.setState(
              {
                isConnected: false,
              },
              () => {
                setTimeout(() => {
                  this.props.history.push("/dashboard");
                  this.props.keycloak.logout();
                  UserService.logout();
                }, 500);
              }
            );
          }, 1000);
        }
      });
    }
  };

  getMessage = (data) => {
    this.setState(
      {
        incomingMsg: data,
        outgoingMsg: "",
      },
      () => {
        socket.emit("fracSendMessageToAll", this.state.incomingMsg);
      }
    );
  };

  sendMessage = (data) => {
    this.setState(
      {
        outgoingMsg: data,
        incomingMsg: "",
      },
      () => {
        if (this.props.outgoingMsg) {
          this.props.outgoingMsg(this.state.outgoingMsg);
        }
      }
    );
  };

  updateRoom = (currentId, previousId) => {
    this.setState(
      {
        updateRoomId: previousId,
        room: currentId,
      },
      () => {
        if (previousId && previousId.length === 0) {
          previousId = "defaultRoom";
        }
        socket.emit("fracRooms", currentId, previousId);
        this.rePostSession(this.state.clientArray);
      }
    );
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.incomingMsg !== this.props.incomingMsg) {
      this.getMessage(this.props.incomingMsg);
    }

    if (this.props.sendRoomId !== prevProps.sendRoomId) {
      this.updateRoom(this.props.sendRoomId, prevProps.sendRoomId);
    } else {
      if (
        this.props.location !== undefined &&
        this.props.location.state &&
        prevProps.location.state === undefined
      ) {
        this.updateRoom(this.props.location.state.id, this.state.room);
      }
    }

    if (this.props.location && prevProps.location) {
      if (
        this.props.location.state &&
        prevProps.location.state &&
        this.props.location.state.id &&
        prevProps.location.state.id
      ) {
        if (this.props.location.state.id !== prevProps.location.state.id) {
          this.updateRoom(this.props.location.state.id, this.state.room);
        }
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.setState = (state, callback) => {
      return;
    };
  }

  render() {
    return (
      <React.Fragment>
        <nav className="navbar col-12 col-sm-12 col-md-2 col-lg-3 col-xl-3 custom-nav-bar">
          {/* Username and its avatar */}
          <div className="dropdown move-right pt-3">
            <p
              className="pr-2"
              role="button"
              id="dropdownMenuLinkThree"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <span className="">{this.state.firstName}</span>
              <span className="ml-2 cursorStyleOne profile-circle text-uppercase">
                {this.state.genAvatar}
              </span>
            </p>

            {/* Dropdown menu */}
            <div
              className="dropdown-menu profile-dropdown mr-4"
              aria-labelledby="dropdownMenuLinkThree"
              style={{
                left: "-80%",
                right: "0px",
              }}
            >
              <a
                href="https://forms.gle/2DxEhBYL2J6B6wCj6"
                target="_blank"
                rel="noopener noreferrer"
              >
                <p className="dropdown-item">Feedback</p>
              </a>
              <p
                className="dropdown-item"
                onClick={() => this.props.history.push("/walkthrough")}
              >
                Walkthrough
              </p>

              <p
                className="dropdown-item"
                onClick={() => this.props.history.push("/release-notes")}
              >
                What's new
              </p>
              <p className="dropdown-item" onClick={this.logout}>
                Logout
              </p>
            </div>
          </div>
        </nav>
      </React.Fragment>
    );
  }
}

export default InfoNavBar;

import React from "react";
import { NavLink } from "react-router-dom";
// import Notify from "../../../helpers/notify";
import { APP } from "../../../constants";

class ColumnTwo extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <div
        className="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2 bordered custom-full-height-4"
        id="workflowDetail"
      >
        <div className="pl-2 mt-4">
          <h1>{this.props && this.props.title}</h1>
          <div className="pl-2 pr-2 mt-4">
            <div id="mepList">
              <NavLink
                className=""
                to={{
                  pathname:
                    APP.WORKFLOWS.DETAIL +
                    `/overview-${this.props && this.props.title.toLowerCase()}`,
                }}
              >
                <div
                  className={`pl-3 pt-3 mb-2 mr-min-1 ${
                    this.props.history &&
                    this.props.history.location.pathname.match(
                      APP.WORKFLOWS.DETAIL + `/overview-`
                    )
                      ? "active-list-selection-1 workflow-border-1 "
                      : "list-selection-1"
                  } `}
                >
                  <h6>Overview</h6>
                </div>
              </NavLink>

              {this.props &&
                this.props.id &&
                this.props.location &&
                ((this.props.location.state &&
                  this.props.location.state.id === 0) ||
                  this.props.match.params.id === "0") &&
                this.props.type && (
                  <NavLink
                    className=""
                    to={{
                      pathname: `${APP.WORKFLOWS.LEVEL}/${
                        this.props && this.props.title.toLowerCase()
                      }/0`,
                      state: { id: this.props.id, type: this.props.type },
                    }}
                  >
                    <div
                      className={`pl-3 pt-3 mb-2 mr-min-1 ${
                        this.props.history &&
                        this.props.history.location.pathname.match(
                          `${APP.WORKFLOWS.LEVEL}/${
                            this.props && this.props.title.toLowerCase()
                          }/0`
                        )
                          ? "active-list-selection-1 workflow-border-2"
                          : "list-selection-1"
                      } `}
                    >
                      <h6>*unnamed level</h6>
                    </div>
                  </NavLink>
                )}

              {this.props.location &&
                ((this.props.location.state &&
                  this.props.location.state.id > 0) ||
                  this.props.id > 0) && (
                  <NavLink
                    className=""
                    to={{
                      pathname: `${APP.WORKFLOWS.LEVEL}/${
                        this.props && this.props.title.toLowerCase()
                      }/${
                        this.props.location.state
                          ? this.props.location.state.id
                          : this.props.id
                      }`,
                      state: {
                        id: this.props.location.state
                          ? this.props.location.state.id
                          : this.props.id,
                        type: this.props.type,
                        level: this.props.location.state
                          ? this.props.location.state.level
                          : `Level ${
                              this.props.location.pathname.split("/")[2]
                            }`,
                      },
                    }}
                  >
                    <div
                      className={`pl-3 pt-3 mb-2 mr-min-1 ${
                        this.props.history &&
                        this.props.history.location.pathname.match(
                          `${APP.WORKFLOWS.LEVEL}/${
                            this.props && this.props.title.toLowerCase()
                          }/${
                            this.props.location.state
                              ? this.props.location.state.id
                              : this.props.id
                          }`
                        )
                          ? "active-list-selection-1 workflow-border-2"
                          : "list-selection-1"
                      } `}
                    >
                      <h6>
                        {this.props.location.state
                          ? this.props.location.state.level
                          : `Level ${
                              this.props.location.pathname.split("/")[3]
                            }`}
                      </h6>
                    </div>
                  </NavLink>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ColumnTwo;

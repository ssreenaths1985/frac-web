import React from "react";
import moment from "moment";
import "moment-timezone";

/**
 * Components display the activity logs
 */

class ActivityLogs extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      selectedNodeObj: {},
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  formatDate = (value) => {
    let fmt = "DD/MM/YYYY HH:mm";
    let formatedDateTime = moment.utc(value);
    let localTimeZone = moment.tz.guess();
    return formatedDateTime.tz(localTimeZone).format(fmt);
  };

  getNode(nodeObj) {
    this.setState({
      selectedNodeObj: nodeObj,
    });
  }

  addTags(textValue) {
    return ((textValue.replace(/Changed from '/g, "</i><br><br>Changed from '")
      .replace(/' to '/g, "'<br>' to '<i>")))
      .replace("</i><br><br>Changed from '", "Changed from '");
  }

  render() {
    return (
      <React.Fragment>
        {this.props.activityLogs !== undefined &&
          !this.props.activityLogs.length && (
            <p className="pt-3">No activity found!</p>
          )}

        {this.props.activityLogs === undefined && (
          <p className="pt-3">No activity found!</p>
        )}

        <div className="w-100 d-block">
          {this.props.activityLogs !== undefined &&
            this.props.activityLogs.length &&
            this.props.activityLogs.map((i, j) => {
              let nodeLabelSix = i.reference;
              if (i.reference) {
                nodeLabelSix = i.reference.split("::");
              }
              return (
                <div className="row" key={j}>
                  <div className="col-12 p-0">
                    <div className="activity-log-card pt-3 pl-3 pr-3">
                      <p className="activity-log-name m-0">
                        {i.user !== null && i.user}
                      </p>
                      {i.changeStatement &&
                        i.changeStatement.length > 0 &&
                        i.changeStatement.split("::").map((data, index) => {
                          if (data.length) {
                            return (
                              <div key={index}>
                                {nodeLabelSix && nodeLabelSix[index] && (
                                  <p className="activity-ref m-0 pt-3">
                                    {nodeLabelSix[index]}
                                  </p>
                                )}
                                <p className="m-0 pt-1">
                                  <label className="tab-text-2 w-100" key={index}
                                    dangerouslySetInnerHTML={{ __html: this.addTags(data) }}>
                                  </label>
                                </p>
                              </div>
                            );
                          } else {
                            return null;
                          }
                        })}
                      {i.comments && (
                        <div
                          className="col-12 comment-cca-card row ml-0 mb-1 p-2 pointer-style border-radius-1"
                          data-toggle="modal"
                          data-target="#newACModal"
                          onClick={() => {
                            this.getNode(i);
                          }}
                        >
                          <div className="col-2 p-0">
                            <span className="material-icons comment-icon-1">
                              insert_comment
                            </span>
                            {/* Review modal form */}
                            <div
                              className="modal fade fadeInUp"
                              id="newACModal"
                              tabIndex="-1"
                              role="dialog"
                              aria-labelledby="newACModalTitle"
                              aria-hidden="true"
                            >
                              <div
                                className="modal-dialog modal-dialog-centered"
                                role="document"
                              >
                                <div className="modal-content">
                                  <div className="modal-body remove-scroll-x">
                                    <div className="col-12 p-0">
                                      <div className="activity-log-card pl-4 pr-4 ml-3 mr-3">
                                        <div className="pt-3">
                                          {this.state.selectedNodeObj.user && (
                                            <p className="activity-log-name m-0">
                                              {this.state.selectedNodeObj.user}
                                            </p>
                                          )}
                                        </div>

                                        {this.state.selectedNodeObj.reference &&
                                          this.state.selectedNodeObj.reference
                                            .split("::")
                                            .map((data, index) => {
                                              if (data.length) {
                                                return (
                                                  <p
                                                    className="activity-ref m-0 pt-2"
                                                    key={index}
                                                  >
                                                    <label
                                                      className="activity-ref m-0"
                                                      key={index}
                                                      style={{
                                                        display: "block",
                                                        lineHeight: "1.15rem",
                                                      }}
                                                    >
                                                      {data}
                                                    </label>
                                                  </p>
                                                );
                                              } else {
                                                return null;
                                              }
                                            })}
                                        {this.state.selectedNodeObj
                                          .changeStatement &&
                                          this.state.selectedNodeObj.changeStatement
                                            .split("::")
                                            .map((data, index) => {
                                              if (data.length) {
                                                return (
                                                  <p
                                                    className="m-0"
                                                    key={index}
                                                  >
                                                    <label
                                                      className="tab-text-2"
                                                      key={index}
                                                      style={{
                                                        lineHeight: "1.15rem",
                                                      }}
                                                    >
                                                      {data}
                                                    </label>
                                                  </p>
                                                );
                                              } else {
                                                return null;
                                              }
                                            })}

                                        <p className="tab-text-3 mt-2">
                                          {this.state.selectedNodeObj
                                            .updatedDate &&
                                            this.formatDate(
                                              this.state.selectedNodeObj
                                                .updatedDate
                                            )}
                                        </p>
                                      </div>
                                      <div className="note-section mt-3 pt-3 pb-2 pl-4 pr-4 ml-3 mr-3 mb-2">
                                        <label className="m-0">Note</label>
                                        {this.state.selectedNodeObj.comments && (
                                          <p
                                            className=""
                                            style={{ lineHeight: "1.15rem" }}
                                          >
                                            {this.state.selectedNodeObj.comments}
                                          </p>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="modal-footer">
                                    <div className="row">
                                      <button
                                        type="button"
                                        className="btn save-button mr-2 custom-primary-button"
                                        data-dismiss="modal"
                                      >
                                        Close
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="col-10">
                            <div
                              className="comment-style-1 truncateText">
                              {i.comments}
                            </div>
                          </div>
                        </div>
                      )}
                      {i.updatedDate && (
                        <p className="activity-log-name m-0 pt-1 pb-3">
                          {this.formatDate(i.updatedDate)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            }
            )}
        </div>
      </React.Fragment>
    );
  }
}

export default ActivityLogs;

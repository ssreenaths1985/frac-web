import React from "react";
import ActivityLogs from "../common/ActivityLogs";
import Live from "../common/Live";
import Preview from "../../../review/views/Preview";
import ColumnFour from "../positions/ColumnFour";
import { APP } from "../../../../constants";

/**
 * Components display the activity logs and its
 * related items
 */

class ColumnSix extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      msgCount: 0,
    };
  }

  componentDidMount() {
    this._isMounted = true;
    if (document.getElementById("messageArea")) {
      document.getElementById("messageArea").addEventListener("click", () => {
        this.setState({
          msgCount: 0,
        });
      });
    }

    if (document.getElementById("chatArea")) {
      document.getElementById("chatArea").addEventListener("click", () => {
        this.setState({
          msgCount: 0,
        });
      });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    this._isMounted = false;
    this.setState = (state, callback) => {
      return;
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props && this.props.getMessage) {
      if (prevProps && prevProps.getMessage !== this.props.getMessage) {
        this.setState({
          msgCount: this.state.msgCount + 1,
        });
      }
    }

    // tab selection
    const parentList = document.getElementById('column-six-tabs');
    if (parentList && parentList.childNodes) {
      for (let i = 0; i < parentList.childNodes.length; i++) {
        if (parentList.childNodes[i] && parentList.childNodes[i].childNodes) {
          for (let j = 0; j < parentList.childNodes[i].childNodes.length; j++) {
            const refElement = parentList.childNodes[i].childNodes[j];
            if (refElement.tagName === "A" && refElement.getAttribute("href") === this.props.activeTabId) {
              refElement.click();
            }
          }
        }
      }
    }
  }

  render() {
    return (
      <div
        className={`col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 bordered ${this.props.customHeight}`}
        id="columnFiveMaster">
        <div id="officerColumn4" className="mt-3">
          <ul
            className="nav nav-pills mb-3 mt-1 custom-officer-margin"
            id="column-six-tabs"
            role="tablist">
            <li className="nav-item">
              <a
                className="nav-link active text-center custom-officer-margin tab-text-1"
                id="pills-live-tab"
                data-toggle="pill"
                href="#live-column-six"
                role="tab"
                aria-controls="pills-home"
                aria-selected="true">
                {this.props.review && this.props.review === "true"
                  ? "Review"
                  : "Live"}
                {((this.props.review && this.props.review !== "true") ||
                  (!this.props.review && this.props.getMessage)) &&
                  this.state.msgCount > 0 &&
                  this.props.location.state.id ===
                  this.props.getMessage.roomId && (
                    <span className="chat-notification-1" id="messageBadge">
                      {this.state.msgCount}
                    </span>
                  )}
              </a>
            </li>
            <li className="nav-item">
              <a
                className="nav-link text-center custom-officer-margin tab-text-1"
                id="pills-home-tab"
                data-toggle="pill"
                href="#activity-logs-column-six"
                role="tab"
                aria-controls="pills-home"
                aria-selected="true">
                Activity log
              </a>
            </li>
            {this.props.review && this.props.review === "true" && (
              <li className="nav-item">
                <a
                  className="nav-link text-center custom-officer-margin tab-text-1"
                  id="pills-home-tab"
                  data-toggle="pill"
                  href="#live-two-column-six"
                  role="tab"
                  aria-controls="pills-home"
                  aria-selected="true">
                  Live
                  {this.props.getMessage &&
                    this.state.msgCount > 0 &&
                    this.props.location.state.id ===
                    this.props.getMessage.roomId && (
                      <span className="chat-notification-1" id="messageBadge">
                        {this.state.msgCount}
                      </span>
                    )}
                </a>
              </li>
            )}
            <li className="nav-item">
              <a
                className="nav-link text-center custom-officer-margin tab-text-1"
                id="pills-home-tab"
                data-toggle="pill"
                href={APP.PARAMETERS.SIMILAR_ITEM_TAB_REF}
                role="tab"
                aria-controls="pills-home"
                aria-selected="true">
                Similar items
              </a>
            </li>
          </ul>
        </div>
        <div className="tab-content m-2" id="pills-tabContent">
          <div
            className="tab-pane fade show active"
            id="live-column-six"
            role="tabpanel"
            aria-labelledby="pills-live-tab">
            {this.props.review && this.props.review === "true" ? (
              <Preview {...this.props} />
            ) : (
              <Live {...this.props} />
            )}
          </div>
          <div
            className="tab-pane fade"
            id="activity-logs-column-six"
            role="tabpanel"
            aria-labelledby="pills-home-tab">
            <ActivityLogs {...this.props} />
          </div>
          {this.props.review && this.props.review && (
            <div
              className="tab-pane fade"
              id="live-two-column-six"
              role="tabpanel"
              aria-labelledby="pills-home-tab">
              <Live {...this.props} />
            </div>
          )}
          <div
            className="tab-pane fade"
            id="similar-items-column-six"
            role="tabpanel"
            aria-labelledby="pills-home-tab">
            <ColumnFour
              {...this.props}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ColumnSix;

import React from "react";
import { NavLink } from "react-router-dom";
// import Notify from "../../../helpers/notify";
import { APP } from "../../../constants";

class CreateLevel extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      enableThumbNail: false,
    };
    this.loadThumbNail = this.loadThumbNail.bind(this);
    this.clearThumbNail = this.clearThumbNail.bind(this);
    this.sendPublishData = this.sendPublishData.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  loadThumbNail = (event) => {
    event.preventDefault();

    let reader = new FileReader();

    reader.onload = () => {
      this.setState(
        {
          enableThumbNail: true,
        },
        () => {
          let output = document.getElementById("levelThumbnail");
          output.src = reader.result;
        }
      );
    };

    if (event.target.files[0]) {
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  clearThumbNail = (e) => {
    e.preventDefault();

    let output = document.getElementById("levelThumbnail");
    output.src = "null";
    this.setState({
      enableThumbNail: false,
    });
  };

  sendPublishData = () => {
    if (this.props) {
      this.props.getFilledState(true);
    }
  };

  render() {
    return (
      <div
        className="col-xs-12 col-sm-12 col-md-8 col-lg-8 col-xl-8 bordered custom-full-height-4 custom-body-bg"
        id="workflowForm"
      >
        <div className="pl-2 mt-4">
          <div className="d-flex justify-content-between flex-row">
            <div className="">
              <NavLink
                className="breadcrumb-1 navlink-style-1"
                to={{
                  pathname: APP.WORKFLOWS.DASHBOARD,
                }}
              >
                Workflows
              </NavLink>

              <span className="material-icons breadcrumb-icon-1">
                arrow_forward_ios
              </span>
              <label className="breadcrumb-1">
                {this.props && this.props.title}
              </label>
            </div>
          </div>
          <div className="mt-4">
            <form
              onSubmit={() => {
                this.sendPublishData();
                this.props.history.push({
                  pathname: `${APP.WORKFLOWS.LEVEL}/${
                    this.props && this.props.title.toLowerCase()
                  }/1`,
                  state: { id: 1, level: "Level 1" },
                });
              }}
            >
              <h2 className="mt-3">Thumbnail</h2>
              <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 p-0 mt-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => this.loadThumbNail(event)}
                  style={{ display: "none" }}
                  id="thumbnailUpload"
                />
                {this.state.enableThumbNail && (
                  <div className="thumbnail-container">
                    <img
                      id="levelThumbnail"
                      alt="level thumbnail"
                      className="level-thumbnail-2"
                      onClick={(e) => this.clearThumbNail(e)}
                    />
                    <div className="overlay-center">
                      <span className="material-icons cancel-icon-2">
                        cancel
                      </span>
                    </div>
                  </div>
                )}

                {!this.state.enableThumbNail && (
                  <label htmlFor="thumbnailUpload">
                    <div className="level-thumbnail">
                      <p>+</p>
                    </div>
                  </label>
                )}
              </div>
              <h2 className="mt-3">Level label</h2>
              <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 p-0">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type here"
                ></input>
              </div>
              <h2 className="mt-4">Description</h2>
              <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 p-0">
                <textarea
                  className="form-control mt-2"
                  id="description"
                  rows="5"
                  placeholder="Type the note here"
                ></textarea>
              </div>
              <div className="d-flex flex-row p-0 col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 justify-content-between">
                <button
                  type="button"
                  className="btn save-button float-left cancel-button p-0 mt-0 mt-sm-2 mt-md-2 mt-lg-3"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn save-button custom-primary-button mr-0 mt-0 mt-sm-2 mt-md-2 mt-lg-3"
                >
                  Save
                </button>
              </div>
            </form>
            <div id="workflowTabs" className="mt-5 ml-3">
              <ul
                className="nav nav-pills mb-3 mt-1 custom-officer-margin"
                id="pills-tab"
                role="tablist"
              >
                <li className="nav-item">
                  <a
                    className="nav-link active text-center custom-officer-margin"
                    id="pills-home-tab"
                    data-toggle="pill"
                    href="#pills-conditions"
                    role="tab"
                    aria-controls="pills-home"
                    aria-selected="true"
                  >
                    Conditions
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link text-center custom-officer-margin"
                    id="pills-home-tab"
                    data-toggle="pill"
                    href="#pills-access"
                    role="tab"
                    aria-controls="pills-home"
                    aria-selected="true"
                  >
                    Access
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link text-center custom-officer-margin"
                    id="pills-home-tab"
                    data-toggle="pill"
                    href="#pills-officers"
                    role="tab"
                    aria-controls="pills-home"
                    aria-selected="true"
                  >
                    Officers
                  </a>
                </li>
              </ul>
            </div>
            <div className="tab-content m-2" id="pills-tabContent">
              <div
                className="tab-pane fade show active"
                id="pills-conditions"
                role="tabpanel"
                aria-labelledby="pills-home-tab"
              >
                <p className="pills-workflow-labels">
                  Conditions can be defined after the level is created
                </p>
              </div>
              <div
                className="tab-pane fade show"
                id="pills-access"
                role="tabpanel"
                aria-labelledby="pills-home-tab"
              >
                <p className="pills-workflow-labels">
                  Access can be defined after the level is created
                </p>
              </div>
              <div
                className="tab-pane fade show"
                id="pills-officers"
                role="tabpanel"
                aria-labelledby="pills-home-tab"
              >
                <p className="pills-workflow-labels">
                  Officers can be defined after the level is created
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateLevel;

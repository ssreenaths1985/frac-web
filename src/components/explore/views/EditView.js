import React from "react";
import { MasterService } from "../../../services/master.service";
import Notify from "../../../helpers/notify";
import { APP } from "../../../constants";

class EditView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedType: "",
      styleClass: "",
      data: {
        id: "",
        type: this.props.selectedItem,
        name: "",
        description: "",
      },
      letterCount: 280,
      enableSave: false,
    };
    this.stringTransform = this.stringTransform.bind(this);
    this.getLetterCount = this.getLetterCount.bind(this);
    this.onChange = this.onChange.bind(this);
    this.getDetails = this.getDetails.bind(this);
  }

  componentDidMount() {
    if (this.props.rightColumnEnabled) {
      this.getDetails();
    }
  }

  stringTransform = (string) => {
    string = string.toLowerCase();
    let resultedString = string.charAt(0).toUpperCase() + string.slice(1);
    return resultedString;
  };

  // Text character counter
  getLetterCount = (event) => {
    this.setState({
      letterCount: 280 - this.state.data.description.length,
    });
  };

  onChange = (e) => {
    e.preventDefault();
    let onlyAlphabet = /^[/+#\-_()., A-Za-z ]*$/;

    switch (e.target.name) {
      case "label":
        if (!onlyAlphabet.test(e.target.value)) {
          return false;
        }
        this.setState(
          {
            data: {
              ...this.state.data,
              name: e.target.value,
            },
          },
          () => {
            this.setState({
              enableSave: true,
            });
          }
        );
        break;
      case "description":
        if (!onlyAlphabet.test(e.target.value)) {
          return false;
        }
        this.setState(
          {
            data: {
              ...this.state.data,
              description: e.target.value,
            },
          },
          () => {
            this.setState({
              enableSave: true,
            });
          }
        );
        break;
      default:
        break;
    }
  };

  getDetails = () => {
    MasterService.getDataByNodeId(
      this.props.selectedID,
      this.props.selectedItem
    ).then((response) => {
      if (
        response &&
        response.data.statusInfo.statusCode === APP.CODE.SUCCESS
      ) {
        this.setState(
          {
            data: {
              ...this.state.data,
              id: response.data.responseData.id,
              name: response.data.responseData.name,
              description: response.data.responseData.description,
            },
          },
          () => this.getLetterCount()
        );
        if (response.data.responseData.additionalProperties) {
          let keys = Object.keys(
            response.data.responseData.additionalProperties
          );

          if (keys.length > 1) {
            keys.map((i, j) => {
              this.setState({
                data: {
                  ...this.state.data,
                  additionalProperties:
                    response.data.responseData.additionalProperties,
                },
              });
              return null;
            });
          } else {
            this.setState({
              data: {
                ...this.state.data,
                additionalProperties:
                  response.data.responseData.additionalProperties,
              },
            });
          }
        }
      } else {
        Notify.error(response && response.data.statusInfo.errorMessage);
      }
    });
  };

  saveDetails = (e) => {
    // To submit/save the position details
    e.preventDefault();
    MasterService.addDataNode(this.state.data).then((response) => {
      if (
        response &&
        response.data.statusInfo.statusCode === APP.CODE.SUCCESS
      ) {
        Notify.dark("Updated successfully");
        this.setState({
          enableSave: false,
        });
        this.props.history.push({
          pathname: "/explore",
        });
      } else {
        Notify.error(response && response.data.statusInfo.errorMessage);
      }
    });
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      this.props.selectedID !== prevProps.selectedID &&
      this.props.rightColumnEnabled
    ) {
      this.getDetails();
    }
  }

  render() {
    if (!this.props.rightColumnEnabled) {
      return (
        <div
          className="col-xs-12 col-sm-12 col-md-12 col-lg-2 col-xl-2 custom-full-height-explore custom-body-bg-2"
          id="editColumn"
        >
          <div className="d-flex flex-column flex-md-row flex-lg-column">
            <h3 className="mt-3">Item type</h3>
            <button
              type="button"
              className="custom-button-2 btn position-border-1 mr-3 mt-3 text-align-left fit-content-width"
            >
              Positions
            </button>
            <button
              type="button"
              className="custom-button-2 btn role-border-1 mr-3 mt-3 text-align-left fit-content-width"
            >
              Roles
            </button>
            <button
              type="button"
              className="custom-button-2 btn activity-border-1 mr-3 mt-3 text-align-left fit-content-width"
            >
              Activities
            </button>
            <button
              type="button"
              className="custom-button-2 btn competency-border-1 mr-3 mt-3 text-align-left fit-content-width"
            >
              Competencies
            </button>
            <button
              type="button"
              className="custom-button-2 btn kr-border-1 mr-3 mb-2 mt-3 text-align-left fit-content-width"
            >
              Knowledge Resource
            </button>
          </div>
          <hr></hr>
        </div>
      );
    } else {
      return (
        <div
          className="col-xs-12 col-sm-12 col-md-12 col-lg-2 col-xl-2 custom-full-height-explore custom-body-bg-2 custom-min-width-5"
          id="editColumn"
        >
          <form onSubmit={this.saveDetails}>
            <div className="">
              <h3 className="mt-3">Item type</h3>
              <button
                type="button"
                className={`custom-button-2 btn mr-3 mt-3 text-align-left fit-content-width ${this.props.styleClassName}`}
              >
                {this.stringTransform(this.props.selectedItem)}
              </button>
            </div>
            <hr></hr>
            <div className="" id="columnFiveMaster">
              <label className="custom-label-1">ID</label>
              <div className="col-xs-12 col-sm-12 col-md-11 col-lg-11 col-xl-11 p-0 mb-2">
                <input
                  type="text"
                  id="expertID"
                  className="form-control no-border-radius"
                  placeholder="ID"
                  aria-label="id"
                  value={this.state.data.id}
                  aria-describedby="basicId"
                  disabled
                />
              </div>
              <label className="mt-3 custom-label-1">Label</label>
              <div className="col-xs-12 col-sm-12 col-md-11 col-lg-11 col-xl-11 p-0 mb-3">
                <input
                  type="text"
                  id="label"
                  className="form-control no-border-radius"
                  placeholder="Label"
                  aria-label="label"
                  aria-describedby="basicLabel"
                  name="label"
                  value={this.state.data.name}
                  onChange={this.onChange}
                  autoComplete="off"
                  onKeyUp={(event) => {}}
                  required
                />
              </div>
              <label className="custom-label-1">Description</label>
              <div className="col-xs-12 col-sm-12 col-md-11 col-lg-11 col-xl-11 p-0 mb-1">
                <textarea
                  className="form-control no-border-radius"
                  id="description"
                  rows="4"
                  placeholder="Description..."
                  name="description"
                  onChange={this.onChange}
                  value={this.state.data.description}
                  autoComplete="off"
                  onKeyUp={(event) => {
                    this.getLetterCount(event);
                  }}
                  required
                ></textarea>
              </div>
              <p
                className={` ${
                  this.state.letterCount < 0
                    ? "change-text-color"
                    : "change-text-color-1"
                }`}
              >
                Characters remaining: {this.state.letterCount}
              </p>
            </div>
            {this.state.enableSave && (
              <button
                type="submit"
                className="btn save-button custom-primary-button mb-3 push-bottom-4"
              >
                Save
              </button>
            )}
            {!this.state.enableSave && (
              <button
                type="submit"
                className="btn save-button custom-primary-button-disabled mb-3 push-bottom-4"
                disabled
              >
                Save
              </button>
            )}
          </form>
        </div>
      );
    }
  }
}

export default EditView;

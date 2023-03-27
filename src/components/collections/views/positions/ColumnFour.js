import React from "react";
import { MasterService } from "../../../../services/master.service";
import Notify from "../../../../helpers/notify";
import { APP } from "../../../../constants";

class ColumnFour extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedId: "",
      data: [],
      dataTwo: [],
      name: "",
      description: "",
      department: "",
      url: "",
    };
    this.getDetails = this.getDetails.bind(this);
    this.getChildNodes = this.getChildNodes.bind(this);
    this.searchData = this.searchData.bind(this);
  }

  componentDidMount() {
    if (this.state.selectedId) {
      this.getDetails();
      this.getChildNodes();
    }
  }

  searchData = () => {
    // Declare variables
    let input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("mappedSearch");
    filter = input.value.toUpperCase();
    ul = document.getElementById("mappedList");
    li = ul.getElementsByTagName("div");

    // Loop through all list items, and hide those who don't match the search query
    for (i = 0; i < li.length; i++) {
      a = li[i];
      txtValue = a.textContent || a.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        li[i].style.display = "";
      } else {
        li[i].style.display = "none";
      }
    }
  };

  getDetails = () => {
    MasterService.getDataByNodeId(this.state.selectedId, this.props.type).then(
      (response) => {
        if (
          response &&
          response.data.statusInfo.statusCode === APP.CODE.SUCCESS
        ) {
          this.setState({
            data: response.data.responseData,
            name: response.data.responseData.name,
            description: response.data.responseData.description,
          });
        } else {
          Notify.error(response && response.data.statusInfo.errorMessage);
        }
      }
    );
  };

  getChildNodes = () => {
    if (this.props.functionName === "getParentNode") {
      MasterService.getParentNode(this.state.selectedId, this.props.type).then(
        (response) => {
          if (
            response &&
            response.data.statusInfo.statusCode === APP.CODE.SUCCESS
          ) {
            this.setState({
              dataTwo: response.data.responseData,
            });
          } else {
            Notify.error(response && response.data.statusInfo.errorMessage);
          }
        }
      );
    } else {
      MasterService.getChildForParent(
        this.state.selectedId,
        this.props.type
      ).then((response) => {
        if (
          response &&
          response.data.statusInfo.statusCode === APP.CODE.SUCCESS
        ) {
          this.setState({
            dataTwo: response.data.responseData,
          });
        } else {
          Notify.error(response && response.data.statusInfo.errorMessage);
        }
      });
    }
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevState.selectedId !== this.state.selectedId) {
      if (this.state.selectedId) {
        this.getDetails();
        this.getChildNodes();
      }
    }
  }

  render() {
    return (
      <div
        className="col-12 custom-full-height-4"
        id="columnFourMaster">
        <div className="m-2">
          <h1 className="mb-4 mt-4">{this.props.searchHeading}</h1>
          {this.props.searchData && this.props.searchData[0] &&
            this.props.searchData[0].map((value, index) => {
              if (value) {
                return (
                  <div
                    className={`card mb-3 search-card pointer-style fadeInUp ${this.props.searchClass}`}
                    data-toggle="modal"
                    data-target="#newModal"
                    key={value.id}
                    onClick={() => this.setState({ selectedId: value.id })}
                  >
                    <h2 className="description-preview">
                      {value.name ? value.name : value.description}
                    </h2>
                    <label>{value.id}</label>
                    <p>{value.description}</p>
                  </div>
                );
              }
              return null;
            })}
          {this.props.searchData && (!this.props.searchData[0] || this.props.searchData[0].length === 0) && (
            <p className="placeholder-style-1">No Similar items found...</p>
          )}
          <div
            className="modal fade fadeInUp"
            id="newModal"
            tabIndex="-1"
            role="dialog"
            aria-labelledby="newRoleModalTitle"
            aria-hidden="true"
          >
            <div
              className="modal-dialog modal-dialog-centered modal-lg"
              role="document"
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="newRoleModalLongTitle">
                    Preview
                  </h5>
                </div>
                <div className="modal-body">
                  <div className="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 mb-3">
                    <div
                      className={`card mb-3 search-card pointer-style ${this.props.searchClass}`}
                    >
                      <h2>{this.state.data.name}</h2>
                      <label>{this.state.data.id}</label>
                      <p>{this.state.data.description}</p>
                    </div>
                  </div>
                  <h1>{this.props.titleSecondary}</h1>

                  <div
                    className="col-xs-12 col-sm-12 col-md-4 col-lg-4 col-xl-4 mb-4 mt-3 p-0 "
                    id="officerBucketsList"
                  >
                    <input
                      type="text"
                      className="form-control mb-4 custom-search-5 custom-search-bar-3"
                      placeholder="Search..."
                      name="search"
                      id="mappedSearch"
                      onKeyUp={this.searchData}
                      autoComplete="off"
                    />
                  </div>
                  <div id="mappedList">
                    <div className="row col-12 ml-1 mb-3">
                      {this.state.dataTwo &&
                        this.state.dataTwo.map((value, index) => {
                          return (
                            <div
                              className={`col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5 card mr-5 mb-3 cca-card pointer-style ${this.props.searchClass2}`}
                              key={value.id}
                            >
                              <div className="ml-0 mt-2 pt-1 pl-2">
                                <p className="pt-1 custom-heading-1 description-preview">
                                  {value.name ? value.name : value.description}
                                </p>
                                <p className="custom-sub-heading-1 custom-line-height-1 pb-2">
                                  {value.id}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <div className="row">
                    <button
                      type="button"
                      className="btn save-button mr-2"
                      data-dismiss="modal"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      data-dismiss="modal"
                      className="btn save-button mr-2"
                      onClick={() =>
                        this.props.history.push({
                          pathname: this.props.url + this.state.selectedId,
                          state: {
                            [this.props.stateDataKey]: false,
                            id: this.state.selectedId,
                            type: this.props.type,
                          },
                        })
                      }
                    >
                      {this.props.btnText}
                    </button>
                    <button
                      type="button"
                      className="btn save-button custom-primary-button"
                      data-dismiss="modal"
                      onClick={() =>
                        this.props.receiveData(
                          this.state.name,
                          this.state.description
                        )
                      }
                    >
                      {this.props.actioBtnText}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ColumnFour;

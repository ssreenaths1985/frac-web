import React from "react";

/**
 ** Search Bar component which enables and handles
 ** the search feature for Graph Visualization
 **/

class SearchBar extends React.Component {
  render() {
    return (
      <div className="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-12 explore-nav-bar">
        <div className="row">
          {/*Section one*/}
          <div className="col-xs-12 col-sm-12 col-md-7 col-lg-8 col-xl-8">
            <div className="row p-0">
              <div
                className="col-xs-12 col-sm-12 col-md-5 col-lg-3 col-xl-3 mt-1"
                id="officerBucketsList"
              >
                <input
                  type="text"
                  className="form-control custom-search-6 custom-search-bar-4"
                  placeholder="Search..."
                  name="search"
                  id="competencySearch"
                  onKeyUp={(event) => {
                    this.props.searchNode(event);
                  }}
                  autoComplete="off"
                />
              </div>

              {!this.props.editDetails && (
                <React.Fragment>
                  <button
                    type="button"
                    className="btn custom-primary-button-2 mr-3 ml-3 mb-3 mb-xs-3 mb-sm-3 mb-md-0 mb-lg-0 mb-xl-0 custom-margin-left-165"
                    onClick={() => {
                      if (!this.props.editDetails) {
                        this.props.showEditColumn(true, false);
                      } else {
                        this.props.showEditColumn(false, false);
                      }
                    }}
                  >
                    Edit
                  </button>
                </React.Fragment>
              )}

              {this.props.editDetails && (
                <React.Fragment>
                  <button
                    type="button"
                    className="btn custom-primary-button-3 mr-3 ml-3 height-1"
                    onClick={() => {
                      this.props.showEditColumn(false, false);
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn custom-primary-button-3 mr-3 height-1"
                    disabled
                  >
                    Save
                  </button>
                </React.Fragment>
              )}

              <button
                type="button"
                className="btn custom-primary-button-3 height-1"
                onClick={() => {
                  if (!this.props.showNewNode) {
                    this.props.showNewColumn(true, false);
                  } else {
                    this.props.showNewColumn(false, false);
                  }
                }}
              >
                Create new item
              </button>
            </div>
          </div>

          {/*Section two*/}
          <div className="col-xs-12 col-sm-12 col-md-5 col-lg-4 col-xl-4 custom-margin-top-75">
            <div className="pull-right">
              <button
                type="button"
                className={`btn mr-3 mb-3 mb-xs-3 mb-sm-3 mb-md-0 mb-lg-0 mb-xl-0 ${this.props.classOne} ${this.props.classTwo}`}
                onClick={() => {
                  if (this.props.changeTxt === "Full Screen") {
                    this.props.fullScreen();
                  } else {
                    this.props.closeScreen();
                  }
                }}
              >
                {this.props.changeTxt}
              </button>
              <button
                type="button"
                className="btn save-button-no-border fit-button-1 mb-3 mb-xs-3 mb-sm-3 mb-md-0 mb-lg-0 mb-xl-0"
                onClick={() => {
                  this.props.fitScreen();
                }}
              >
                Fit to screen
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default SearchBar;

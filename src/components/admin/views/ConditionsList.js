import React from "react";
// import { NavLink } from "react-router-dom";
// import Notify from "../../../helpers/notify";
// import { APP } from "../../../constants";

const conditionsList = [
  {
    id: 0,
    value: "User of _______ tool",
  },
  {
    id: 1,
    value: "Courses completed",
  },
  {
    id: 2,
    value: "Rating",
  },
  {
    id: 3,
    value: "Number of contributions",
  },
  {
    id: 4,
    value: "Number of 5 star contributions",
  },
  {
    id: 5,
    value: "Number of competencies",
  },
  {
    id: 6,
    value: "Number of positions",
  },
  {
    id: 7,
    value: "Number of roles",
  },
  {
    id: 8,
    value: "Number of activities",
  },
  {
    id: 9,
    value: "Number of approved contributions",
  },
  {
    id: 10,
    value: "Approval percentage",
  },
  {
    id: 11,
    value: "Karma points",
  },
  {
    id: 12,
    value: "MDO",
  },
  {
    id: 13,
    value: "Location",
  },
  {
    id: 14,
    value: "Position",
  },
];

const cbpCompleted = [
  { id: 0, isActive: true, value: "Drafting competencies" },
  { id: 1, isActive: false, value: "Creating content on iGOT" },
  { id: 2, isActive: false, value: "CBP name" },
];

class ConditionsList extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      data: {
        id: 1,
        value: "Courses completed",
      },
      title: "",
    };
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  render() {
    return (
      <div className="col-12 p-0" id="conditionsList">
        <div className="col-12 mb-4 mt-4" id="officerBucketsList">
          <input
            type="text"
            style={{ marginLeft: "-0.5rem", width: "105%" }}
            className="form-control mb-4 custom-search-5 custom-search-bar-3"
            placeholder="Search..."
            name="search"
            id="mappedSearch"
            onKeyUp={this.searchData}
            autoComplete="off"
          />
        </div>
        <div className="ml-3">
          {conditionsList.map((i, j) => {
            return (
              <div
                className="d-flex flex-row mb-2 condition-row-2 w-100"
                key={j}
                data-toggle="modal"
                style={{ width: "200%"}}
                data-target="#conditionsModal"
                onClick={() =>
                  this.setState({
                    title: i.value,
                  })
                }
              >
                <img
                  style={{ cursor: "grabbing" }}
                  className="pr-2 drag-icon-1 pl-0"
                  src="/img/level/add_black_24dp.svg"
                  alt="drag level"
                />

                {i.value}
              </div>
            );
          })}
        </div>

        {/* Conditions modal */}
        <div
          className="modal fade"
          id="conditionsModal"
          tabIndex="-1"
          role="dialog"
          aria-labelledby="conditionsModalTitle"
          aria-hidden="true"
        >
          <div
            className="modal-dialog modal-dialog-centered"
            role="document"
            id="levelConditionModal"
          >
            <div className="modal-content">
              <div className="modal-body m-2">
                <h1>{this.state.title || "CBPs completed"}</h1>
                <div className="col-12 mt-4" id="officerBucketsList">
                  <input
                    type="text"
                    style={{ marginLeft: "-0.5rem", width: "50%" }}
                    className="form-control mb-2 custom-search-5 custom-search-bar-3"
                    placeholder="Search in CBPs"
                    name="search"
                    id="mappedSearch2"
                    onKeyUp={this.searchData}
                    autoComplete="off"
                  />
                </div>
                <div className="pt-3">
                  {cbpCompleted.map((o, p) => {
                    return (
                      <>
                        <p
                          className="admin-tab-paragraph-1 paragraph-mb-1"
                          key={p}
                        >
                          {o.isActive ? (
                            <span className="material-icons check-box-2 pr-2">
                              check_box
                            </span>
                          ) : (
                            <span className="material-icons check-box-2-disabled pr-2">
                              check_box_outline_blank
                            </span>
                          )}
                          {o.value}
                        </p>
                      </>
                    );
                  })}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn level-cancel-btn-1"
                  data-dismiss="modal"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn level-action-btn-2"
                  data-dismiss="modal"
                  onClick={() =>
                    this.props.getConditionData &&
                    this.props.getConditionData(this.state.data)
                  }
                >
                  Add condition
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ConditionsList;

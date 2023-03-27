import React from "react";
import ReactStars from "react-rating-stars-component";
import { MasterService } from "../../../../services/master.service";
import Notify from "../../../../helpers/notify";
import { APP } from "../../../../constants";
import moment from "moment";
import "moment-timezone";

/**
 * Components display the feedback dropdown
 */

class RatingAndFeedback extends React.Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      ratingCount: 0,
      showFeedbacks: false,
      myFeedBacks: [],
      allFeedBacks: [],
      comment: "",
      averageRating: "",
      type: "",
      id: "",
    };
    this.nameAvatar = this.nameAvatar.bind(this);
    this.postFeedBack = this.postFeedBack.bind(this);
    this.getFeedBack = this.getFeedBack.bind(this);
    this.onCommentChange = this.onCommentChange.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.updateRating = this.updateRating.bind(this);
    this.getAverageRating = this.getAverageRating.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;

    if (this.props) {
      this.setState(
        {
          type: this.props.location.state.type,
          id: this.props.location.state.id,
        },
        () => {
          this.getFeedBack();
          this.getAverageRating();
        }
      );
    }

    if (this.props && this.props.location.state.id !== 0) {
      document.addEventListener("click", (e) => {
        this.setState({
          showFeedbacks: false,
        });

        if (
          document.getElementById("feedback-dd-menu-1") &&
          e.target.className !==
          "material-icons-round star-rating-icon-active" &&
          e.target.className !== "form-control comment-ta"
        ) {
          let h = document.getElementById("feedback-dd-menu-1");

          let cn = h.childNodes[1].childNodes[0].childNodes[0].childNodes;

          if (
            cn[0].innerHTML ===
            `<span class="material-icons-round star-rating-icon-active">star_rate</span>`
          ) {
            cn[0].innerHTML = `<span class="material-icons-round star-rating-icon-inactive">star_rate</span>`;
            cn[1].innerHTML = `<span class="material-icons-round star-rating-icon-inactive">star_rate</span>`;
            cn[2].innerHTML = `<span class="material-icons-round star-rating-icon-inactive">star_rate</span>`;
            cn[3].innerHTML = `<span class="material-icons-round star-rating-icon-inactive">star_rate</span>`;
            cn[4].innerHTML = `<span class="material-icons-round star-rating-icon-inactive">star_rate</span>`;
          }

          if (e.path && e.path.find((o) => o.id === "feedback-dd-menu-1")) {
            document.getElementById("feedback-dd-menu-1").classList.add("show");
          } else {
            document
              .getElementById("feedback-dd-menu-1")
              .classList.remove("show");
          }

          if (e.target && e.target.id === "feedbackDropdownMenu") {
            if (
              document
                .getElementById("feedback-dd-menu-1")
                .classList.contains("show")
            ) {
              document
                .getElementById("feedback-dd-menu-1")
                .classList.remove("show");
            } else {
              document
                .getElementById("feedback-dd-menu-1")
                .classList.add("show");
            }
          }

          if (e.target.innerText === "Give feedback") {
            document
              .getElementById("feedback-dd-menu-1")
              .classList.remove("show");
          }

          this.setState({
            ratingCount: 0,
          });
        }

        if (
          document.getElementById("feedback-dd-menu-1") &&
          e.target.className === "btn feedback-dd-button"
        ) {
          document.getElementById("feedback-dd-menu-1").classList.add("show");

          this.setState({
            showFeedbacks: false,
            comment: "",
          });
        }

        if (document.getElementById("feedback-dd-menu-1")) {
          document
            .getElementById("feedback-dd-menu-1")
            .addEventListener("click", (e) => {
              if (e.target.className.includes("material-icons-round")) {
                this.updateRating(
                  parseInt(e.target.offsetParent.dataset.index) + 1
                );

                setTimeout(() => {
                  document
                    .getElementById("feedback-dd-menu-1")
                    .classList.add("show");

                  let h = document.getElementById("feedback-dd-menu-1");

                  let cn =
                    h.childNodes[1].childNodes[0].childNodes[0].childNodes;

                  if (
                    cn[0].innerHTML ===
                    `<span class="material-icons-round star-rating-icon-inactive">star_rate</span>` &&
                    e.target.offsetParent !== null
                  ) {
                    this.updateRating(
                      parseInt(e.target.offsetParent.dataset.index) + 1
                    );
                    switch (e.target.offsetParent.dataset.index) {
                      case "0":
                        cn[0].innerHTML = `<span class="material-icons-round star-rating-icon-active">star_rate</span>`;
                        break;
                      case "1":
                        cn[0].innerHTML = `<span class="material-icons-round star-rating-icon-active">star_rate</span>`;
                        cn[1].innerHTML = `<span class="material-icons-round star-rating-icon-active">star_rate</span>`;
                        break;
                      case "2":
                        cn[0].innerHTML = `<span class="material-icons-round star-rating-icon-active">star_rate</span>`;
                        cn[1].innerHTML = `<span class="material-icons-round star-rating-icon-active">star_rate</span>`;
                        cn[2].innerHTML = `<span class="material-icons-round star-rating-icon-active">star_rate</span>`;
                        break;
                      case "3":
                        cn[0].innerHTML = `<span class="material-icons-round star-rating-icon-active">star_rate</span>`;
                        cn[1].innerHTML = `<span class="material-icons-round star-rating-icon-active">star_rate</span>`;
                        cn[2].innerHTML = `<span class="material-icons-round star-rating-icon-active">star_rate</span>`;
                        cn[3].innerHTML = `<span class="material-icons-round star-rating-icon-active">star_rate</span>`;
                        break;
                      case "4":
                        cn[0].innerHTML = `<span class="material-icons-round star-rating-icon-active">star_rate</span>`;
                        cn[1].innerHTML = `<span class="material-icons-round star-rating-icon-active">star_rate</span>`;
                        cn[2].innerHTML = `<span class="material-icons-round star-rating-icon-active">star_rate</span>`;
                        cn[3].innerHTML = `<span class="material-icons-round star-rating-icon-active">star_rate</span>`;
                        cn[4].innerHTML = `<span class="material-icons-round star-rating-icon-active">star_rate</span>`;
                        break;
                      default:
                        break;
                    }
                  }
                });
              } else if (e.target.innerText === "See all feedback") {
                this.setState({
                  showFeedbacks: true,
                });
                e.stopPropagation();
              } else if (
                e.target.innerText === "arrow_back" ||
                e.target.parentNode.id === "dropdownNavigations"
              ) {
                this.setState(
                  {
                    showFeedbacks: false,
                  },
                  () => {
                    if (
                      this.props.location.state.type !== this.state.type &&
                      this.props.location.state.id !== this.state.id
                    ) {
                      this.getFeedBack();
                    }
                  }
                );
                e.stopPropagation();
              }
            });
        }
      });
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.setState = (state, callback) => {
      return;
    };
  }

  // Function to generate avatars
  nameAvatar = (value) => {
    let generatedString = value
      .split(/\s/)
      .reduce((res, letter) => (res += letter.slice(0, 1)), "");
    return generatedString;
  };

  onCommentChange = (e) => {
    e.preventDefault();

    if (e.target.name === "fdComment") {
      this.setState({
        comment: e.target.value,
      });
    }
  };

  getFeedBack = () => {
    if (this.state.type && this.state.id) {
      MasterService.getFeedback(this.state.type, this.state.id, true).then(
        (res) => {
          if (res && res.data.statusInfo.statusCode === APP.CODE.SUCCESS) {
            this.setState(
              {
                myFeedBacks: [],
              },
              () => {
                this.setState({
                  myFeedBacks: res.data.responseData,
                });
              }
            );
          } else {
            Notify.error(res && res.data.statusInfo.errorMessage);
          }
        }
      );

      MasterService.getFeedback(this.state.type, this.state.id, false).then(
        (res) => {
          if (res && res.data.statusInfo.statusCode === APP.CODE.SUCCESS) {
            this.setState(
              {
                allFeedBacks: [],
              },
              () => {
                this.setState({
                  allFeedBacks: res.data.responseData,
                });
              }
            );
          } else {
            Notify.error(res && res.data.statusInfo.errorMessage);
          }
        }
      );
    }
  };

  postFeedBack = () => {
    let fdPayload = {
      type: this.state.type,
      id: this.state.id,
      feedback: {
        rating: this.state.ratingCount,
        comments: this.state.comment,
      },
    };

    if (this.state.ratingCount !== 0) {
      MasterService.postFeedback(fdPayload).then((res) => {
        if (res && res.data.statusInfo.statusCode === APP.CODE.SUCCESS) {
          this.setState(
            {
              ratingCount: 0,
              comment: "",
            },
            () => {
              setTimeout(() => {
                this.getFeedBack();
              }, 500);
              Notify.dark("!Feedback posted");
            }
          );
        } else {
          Notify.error(res && res.data.statusInfo.errorMessage);
        }
      });
    } else {
      Notify.warning("Kindly give the ratings");
    }
  };

  formatDate = (value) => {
    let fmt = "DD/MM/YYYY HH:mm";
    let formatedDateTime = moment.utc(value);
    let localTimeZone = moment.tz.guess();
    return formatedDateTime.tz(localTimeZone).format(fmt);
  };

  updateRating = (rating) => {
    this.setState({
      ratingCount: rating,
    });
  };

  getAverageRating = () => {
    if (this.state.type && this.state.id) {
      MasterService.getAverageRating(this.state.type, this.state.id).then(
        (response) => {
          if (
            response &&
            response.data.statusInfo.statusCode === APP.CODE.SUCCESS
          ) {
            if (
              response.data.responseData &&
              response.data.responseData.rating >= 0
            ) {
              this.setState({
                averageRating: response.data.responseData.rating,
              });
            }
          } else {
            Notify.error(response && response.data.statusInfo.errorMessage);
          }
        }
      );
    }
  };

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== "0") {
      if (prevProps.location.state.id !== this.state.id) {
        this.setState(
          {
            id: this.props.location.state.id,
            type: this.props.location.state.type,
          },
          () => {
            this.getFeedBack();
          }
        );
      }
    }
  }

  render() {
    return (
      <div className="">
        <button
          className="btn feedback-dd-button"
          type="button"
          id="feedbackDropdownMenu"
          data-toggle="dropdown"
          data-display="static"
          data-flip="false"
          aria-haspopup="true"
          data-bs-display="static"
          aria-expanded="false">
          Feedback
        </button>
        <div
          className="dropdown-menu dropdown-menu-lg-end feedback-dd-menu dropdown-menu-right"
          aria-labelledby="feedbackDropdownMenu"
          role="menu"
          id="feedback-dd-menu-1">
          {!this.state.showFeedbacks && (
            <React.Fragment>
              {/* Ratings section */}
              <h1>Rating</h1>

              <div className="d-flex justify-content-center">
                <ReactStars
                  count={5}
                  onChange={this.updateRating}
                  size={50}
                  isHalf={false}
                  a11y={true}
                  value={this.state.ratingCount}
                  filledIcon={
                    <span className="material-icons-round star-rating-icon-active">
                      star_rate
                    </span>
                  }
                  emptyIcon={
                    <span className="material-icons-round star-rating-icon-inactive">
                      star_rate
                    </span>
                  }
                />
              </div>

              {/* Comment section */}
              <h1>Comment</h1>
              <textarea
                className="form-control comment-ta"
                placeholder="Add your comment here"
                rows="6"
                cols="35"
                name="fdComment"
                value={this.state.comment}
                onChange={this.onCommentChange}
              ></textarea>

              {/* Action buttons */}
              <div className="">
                <button
                  type="button"
                  className="w-100 mt-3 primary-button-new custom-primary-button"
                  onClick={() => this.postFeedBack()}
                >
                  Give feedback
                </button>
                <button
                  type="button"
                  className="w-100 mt-2 mb-3 secondary-button-new custom-primary-button-3"
                >
                  See all feedback
                </button>
              </div>

              {/* Feedback history section */}
              <h2 className="pt-3">Your feedback history</h2>
              <div className="feedback-scroll">
                {this.state.myFeedBacks &&
                  this.state.myFeedBacks.reverse().map((i, j) => {
                    return (
                      <React.Fragment key={i.updatedDate}>
                        <div className="col-12 mt-4">
                          <div className="row">
                            <div className="col-xs-12 col-sm-12 col-md-9 col-lg-9 col-xl-9">
                              <div className="row">
                                <div className="ml-2 cursorStyleOne profile-circle-4 text-uppercase">
                                  {this.nameAvatar(i.user)}
                                </div>
                                <div className="d-flex flex-column">
                                  <dd className="label-style-1">{i.user}</dd>
                                  <dd className="label-style-2">
                                    {this.formatDate(i.updatedDate)}
                                  </dd>
                                </div>
                              </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                              <div
                                className="row float-right"
                                style={{ marginRight: "0.10em" }}
                              >
                                <dd className="label-style-1 pt-2 pl-3">
                                  {i.rating || 0}
                                </dd>
                                <div
                                  className="material-icons-round star-rating-icon-active"
                                  style={{
                                    fontSize: "1.35em",
                                    paddingTop: "0.15em",
                                  }}
                                >
                                  star_rate
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 mt-2 p-0">
                          <p className="pl-2 pr-2">{i.comments}</p>
                        </div>
                        <hr></hr>
                      </React.Fragment>
                    );
                  })}
              </div>

              {this.state.myFeedBacks.length === 0 && (
                <p className="pt-3">You haven't rated this item yet</p>
              )}
            </React.Fragment>
          )}

          {this.state.showFeedbacks && (
            <React.Fragment>
              {/* Navigation */}
              <div className="d-flex" id="dropdownNavigations">
                <button type="button" className="all-fd-btn p-0">
                  <span className="material-icons">arrow_back</span>
                </button>
                <p
                  className="ml-2 pointer-style"
                  style={{ paddingTop: "0.8em" }}
                >
                  All feedback
                </p>
              </div>

              {/* Rating section */}
              <div className="col-12 p-0 mb-3 mt-3">
                <div className="d-flex justify-content-center">
                  <div className="col-6 p-0">
                    <button type="button" className="btn rating-btn-style-1 ml-1">
                      {this.state.averageRating !== null
                        ? "This version: " + this.state.averageRating
                        : "This version: 0"}
                      <span
                        className="material-icons-round star-rating-icon-active"
                        style={{
                          fontSize: "1.35em",
                          verticalAlign: "text-bottom",
                        }}
                      >
                        star_rate
                      </span>
                    </button>
                  </div>
                  <div className="col-6 p-0">
                    <button
                      type="button"
                      className="btn rating-btn-style-2 ml-3"
                    >
                      {this.state.averageRating !== null
                        ? "Overall: " + this.state.averageRating
                        : "Overall: 0"}
                      <span
                        className="material-icons-round star-rating-icon-active"
                        style={{
                          fontSize: "1.35em",
                          verticalAlign: "text-bottom",
                        }}
                      >
                        star_rate
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* All feedbacks section */}
              <div className="feedback-scroll-2">
                {this.state.allFeedBacks &&
                  this.state.allFeedBacks.reverse().map((i, j) => {
                    return (
                      <React.Fragment key={i.updatedDate}>
                        <div className="col-12 mt-4">
                          <div className="row">
                            <div className="col-xs-12 col-sm-12 col-md-9 col-lg-9 col-xl-9">
                              <div className="row">
                                <div className="ml-2 cursorStyleOne profile-circle-4 text-uppercase">
                                  {this.nameAvatar(i.user)}
                                </div>
                                <div className="d-flex flex-column">
                                  <dd className="label-style-1">{i.user}</dd>
                                  <dd className="label-style-2">
                                    {this.formatDate(i.updatedDate)}
                                  </dd>
                                </div>
                              </div>
                            </div>
                            <div className="col-xs-12 col-sm-12 col-md-3 col-lg-3 col-xl-3">
                              <div
                                className="row float-right"
                                style={{ marginRight: "0.10em" }}
                              >
                                <dd className="label-style-1 pt-2 pl-3">
                                  {i.rating || 0}
                                </dd>
                                <div
                                  className="material-icons-round star-rating-icon-active"
                                  style={{
                                    fontSize: "1.35em",
                                    paddingTop: "0.15em",
                                  }}
                                >
                                  star_rate
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 mt-2 p-0">
                          <p className="pl-2 pr-2">{i.comments}</p>
                        </div>
                        <hr></hr>
                      </React.Fragment>
                    );
                  })}
                {this.state.allFeedBacks.length === 0 && (
                  <p className="pt-3">No feedbacks found!</p>
                )}
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    );
  }
}

export default RatingAndFeedback;

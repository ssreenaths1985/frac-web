import React from "react";
import CryptoJS from "crypto-js";
import { APP } from "../../../constants";

/**
Preview component
**/
class Preview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      typeSelected: "item",
      unverified: ["Reject", "Verify"],
      verified: ["Reject", "Unverify"],
      rejected: ["Verify", "Unverify"],
      primaryText: "",
      secondaryText: "",
      reviewComments: "",
      roles: "",
      userType: "",
    };
    this.getContext = this.getContext.bind(this);
    this.updateNodeStatus = this.updateNodeStatus.bind(this);
    this.onCommentChange = this.onCommentChange.bind(this);
    this.getRoles = this.getRoles.bind(this);
  }

  componentDidMount() {
    this.getRoles();
  }

  componentDidUpdate(prevProps) {
    if (this.props.nodeData !== prevProps.nodeData) {
      this.getContext();
    }
    if (
      this.props.selectedType &&
      this.state.typeSelected !== this.props.selectedType.toLowerCase()
    ) {
      this.setState({
        typeSelected: this.props.selectedType.toLowerCase(),
      });
    }
  }

  // To get user roles
  getRoles = () => {
    if (localStorage.getItem("stateFromNav")) {
      let bytes = CryptoJS.AES.decrypt(
        localStorage.getItem("stateFromNav"),
        "igotcheckIndia*"
      );
      let originalTextRoles = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      this.setState(
        {
          roles: originalTextRoles,
        },
        () => {
          this.getContext();
        }
      );
    }
  };

  // To set the primary and secondary action name
  getContext = () => {
    let status = this.props.nodeData.status;
    if (JSON.stringify(this.state.roles).includes("FRAC_REVIEWER_L2")
      || (JSON.stringify(this.state.roles).includes("FRAC_ADMIN") &&
        (this.props.nodeData.secondaryStatus || this.props.nodeData.status === APP.NODE_STATUS.VERIFIED))) {
      status = this.props.nodeData.secondaryStatus;
    }

    switch (status) {
      case "UNVERIFIED":
        this.setState({
          primaryText: this.state.unverified[0],
          secondaryText: this.state.unverified[1],
        });
        break;
      case "VERIFIED":
        this.setState({
          primaryText: this.state.verified[0],
          secondaryText: this.state.verified[1],
        });
        break;
      case "REJECTED":
        this.setState({
          primaryText: this.state.rejected[0],
          secondaryText: this.state.rejected[1],
        });
        break;
      default:
        this.setState({
          primaryText: this.state.unverified[0],
          secondaryText: this.state.unverified[1],
        });
    }
  };

  // Creates payload for review
  updateNodeStatus = (status) => {
    let userType;
    if (this.state.roles.includes("FRAC_REVIEWER_L1")) {
      userType = "FRAC_REVIEWER_L1";
    }

    if (this.state.roles.includes("FRAC_REVIEWER_L2")) {
      userType = "FRAC_REVIEWER_L2";
    }

    if (this.state.roles.includes("FRAC_ADMIN")) {
      userType = "FRAC_REVIEWER_L2";
    }

    const verifyNode = {
      status: status,
      verified: status === "Verify" ? true : status === "Reject" ? false : null,
      id: this.props.nodeData.id || this.props.location.state.id,
      type: this.props.location.state.type,
      reviewComments: this.state.reviewComments,
      userType: userType,
    };
    return verifyNode;
  };

  // Review comment field onchange method
  onCommentChange = (e) => {
    e.preventDefault();
    this.setState({
      reviewComments: e.target.value,
    });
  };

  render() {
    return (
      <div id="reviewColumnSix">
        <label>Add note</label>
        <textarea
          className="form-control mb-3"
          id="reviewcmt"
          rows={
            this.state.reviewComments && this.state.reviewComments.length > 100
              ? this.state.reviewComments.length / 40
              : 4
          }
          placeholder="Type the note here"
          name="reviewcomment"
          value={this.state.reviewComments}
          onChange={this.onCommentChange}
          autoComplete="off"
        ></textarea>
        <button
          type="button"
          className={`btn mr-2 col-12 mt-2 secondary-custom-height 
          ${this.state.reviewComments.length > 0
              ? "review-secondary-button-1"
              : "review-secondary-button-1-disabled"
            } `}
          onClick={() => {
            this.props.verifyDataNode(
              this.updateNodeStatus(this.state.primaryText)
            );
          }}
          disabled={
            !this.state.reviewComments && this.state.primaryText === "Reject"
          }
        >
          {this.state.primaryText}
        </button>
        <button
          type="button"
          className={`btn mr-2 col-12 mt-3 
          ${this.state.secondaryText === "Verify"
              ? "review-primary-button-1"
              : "new-secondary-btn"
            }`}
          onClick={() => {
            this.props.verifyDataNode(
              this.updateNodeStatus(this.state.secondaryText)
            );
          }}
        >
          {this.state.secondaryText}
        </button>
      </div>
    );
  }
}

export default Preview;

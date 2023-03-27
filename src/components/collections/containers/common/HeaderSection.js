import React from "react";
import BrandSection from "../../../common/BrandSection";
import TopNavBar from "../../../common/TopNavBar";
import InfoNavBar from "../../../common/InfoNavBar";

/**
 * Component which loads the header section
 * of all pages
 */

class HeaderSection extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.receiveClients = this.receiveClients.bind(this);
    this.receiveSessions = this.receiveSessions.bind(this);
  }

  componentDidMount() {
    this._isMounted = true;

    document.addEventListener("click", function (event) {
      if (document.getElementById("dropdownForDeptOne")) {
        document
          .getElementById("dropdownForDeptOne")
          .addEventListener("click", function (event) {
            if (
              event.target.lastChild &&
              event.target.lastChild.id === "deptListOne"
            ) {
              event.stopPropagation();
            } else {
              document.getElementById("deptSearchOne").value = "";
              let li, ul, i, txtValue;
              ul = document.getElementById("deptListOne");
              li = ul.getElementsByTagName("button");

              // Loop through all list items, and hide those who don't match the search query
              for (i = 0; i < li.length; i++) {
                txtValue = li[i].textContent || li[i].innerText;
                if (txtValue.toUpperCase().indexOf("") > -1) {
                  li[i].style.display = "";
                } else {
                  li[i].style.display = "none";
                }
              }
            }
          });
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  receiveClients = (list) => {
    this.props.getClients(list);
  };

  receiveSessions = (data) => {
    this.props.getSessions(data);
  }

  render() {
    return (
      <div className="row">
        <BrandSection />
        <TopNavBar
          pathName={this.props.history.location.pathname}
          history={this.props.history}
          keycloak={this.props.keycloak}
        />
        <InfoNavBar
          {...this.props}
          history={this.props.history}
          keycloak={this.props.keycloak}
          receiveClients={this.receiveClients}
          incomingMsg={this.props.sendData}
          outgoingMsg={this.props.gotData}
          receiveSessions={this.receiveSessions}
        />
      </div>
    );
  }
}

export default HeaderSection;

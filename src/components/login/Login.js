import React from "react";
import { UserService } from "../../services/user.service";
import Auth from "../../helpers/auth";
import { APP } from "../../constants";
import Notify from "../../helpers/notify";
import { NavLink } from "react-router-dom";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false
    };
    if (Auth.isLoggedIn()) {
      this.props.history.push("/dashboard");
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleVisibility = this.toggleVisibility.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    UserService.login(
      event.target.email.value,
      event.target.password.value
    ).then(
      response => {
        if (
          response &&
          response.data.statusInfo.statusCode === APP.CODE.SUCCESS
        ) {
          localStorage.setItem(
            "user",
            JSON.stringify(response.data.responseData)
          );
          this.props.history.push("/dashboard");
        } else {
          Notify.error(response && response.data.statusInfo.errorMessage);
        }
      },
      error => {
        error.statusInfo
          ? Notify.error(error.data.statusInfo.errorMessage)
          : Notify.error(error.message);
      }
    );
    return;
  }

  toggleVisibility = () => {
    var changeType = document.getElementById("inputPassword");
    if (!this.state.isVisible) {
      this.setState(
        {
          isVisible: true
        },
        () => {
          changeType.type = "text";
        }
      );
    } else {
      this.setState(
        {
          isVisible: false
        },
        () => {
          changeType.type = "password";
        }
      );
    }
  };

  render() {
    return (
      <div className="d-md-flex d-lg-flex d-xl-flex full-height">
        <div className="col-md-7 d-none d-md-flex d-lg-flex d-xl-flex">
          <div className="row vertical-center-3">
            <center>
              <img
                className="logo-one"
                src="img/logos/iGOT_Login_Logo.png"
                alt="brand cover one"
              />
            </center>
          </div>

          <div className="row vertical-center-4">
            <center>
              <img
                className="logo-two"
                src="img/logos/FRACING.svg"
                alt="brand cover one"
              />
            </center>
          </div>
        </div>
        <div className="col-md-5 d-md-flex d-lg-flex d-xl-flex login-right-section-bg full-height">
          <div
            className="center-align vertical-center"
            style={{ width: "85%" }}
            id="loginForm"
          >
            <div className="login-form text-center">
              <form className="form-signin" onSubmit={this.handleSubmit}>
                <h1 className="mb-3">Sign in to the portal</h1>
                <label>Email ID</label>
                <input
                  type="email"
                  id="inputEmail"
                  name="email"
                  className="form-control"
                  placeholder="Enter your email id here"
                  autoFocus={true}
                  required
                />
                <label>Password</label>
                <div className="input-container">
                  <input
                    type="password"
                    id="inputPassword"
                    name="password"
                    className="form-control"
                    placeholder="Enter your password here"
                    required
                  />
                  {!this.state.isVisible && (
                    <span
                      className="material-icons icon float-right"
                      onClick={this.toggleVisibility}
                    >
                      visibility
                    </span>
                  )}
                  {this.state.isVisible && (
                    <span
                      className="material-icons icon float-right"
                      onClick={this.toggleVisibility}
                    >
                      visibility_off
                    </span>
                  )}
                </div>
                <button
                  className="btn btn-sm btn-primary btn-block"
                  id="loginBtn"
                  type="submit"
                >
                  LOGIN
                </button>
                <NavLink className="float-right forgot-pwd mt-2" to="/login">
                  FORGOT PASSWORD?
                </NavLink>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;

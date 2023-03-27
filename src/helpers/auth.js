const Auth = {
  get(item) {
    const userToken = localStorage.getItem("user");
    return userToken;
  },

  isLoggedIn() {
    let value;
    if (localStorage.getItem("user")) {
      value = true;
    } else {
      value = false;
    }
    return value;
  }
};

export default Auth;

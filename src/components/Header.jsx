import React from "react";
import Config from '../config/config';

function Header(props) {
  function logOut() {
    props.setLoggedIn(false);
    localStorage.clear();
  }

  return (
    <header>
      <div className="container-fluid navbar">
        <h1 className="navbar-brand">
          Notekeeper
        </h1>
        {props.isLoggedIn && window.localStorage.name && <h2>Logged in as {window.localStorage.name}</h2>}
        {props.isLoggedIn ? <a href={Config.redirect_uri}>
          <button className="btn btn-outline-dark my-2 my-sm-0 btn-lg" onClick={logOut}>Logout</button>
        </a> :
        <a href={Config.auth_server + "/login?client_id=" + Config.client_id + "&response_type=code&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=" + Config.redirect_uri}>
            <button className="btn btn-success my-2 my-sm-0 btn-lg">Login via Facebook or create an account to persist your notes</button>
          </a>}
      </div>
    </header>
  );
}

export default Header;
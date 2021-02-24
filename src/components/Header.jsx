import React from "react";
import Config from 'config';

function Header() {
  return (
    <header>
      <div className="container-fluid navbar">
        <h1 className="navbar-brand">
          Notekeeper
        </h1>
        <a href={"https://notekeeper-wootoodoo.auth.ap-southeast-1.amazoncognito.com/login?client_id=" + Config.get('client_id') + "&response_type=code&scope=aws.cognito.signin.user.admin+email+openid+phone+profile&redirect_uri=https://notes.wootoodoo.com"}>
          <button className="btn btn-outline-success my-2 my-sm-0 btn-lg">Login </button>
        </a>  
      </div>
    </header>
  );
}

export default Header;
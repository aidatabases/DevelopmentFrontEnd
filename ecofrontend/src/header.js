import React, { Component } from "react";
import { Link } from "react-router-dom";
 
class Header extends Component {
  render() {
    return (
      <React.Fragment>
        <nav className="navbar navbar-dark bg-dark mb-3">
          {/* <a className="navbar-brand" href="/">
            <h1>Header component<span className="badge badge-secondary">{this.props.totalItems}</span></h1>
          </a> */}
          <Link to="/"><h1>Header component<span className="badge badge-secondary">{this.props.totalItems}</span></h1></Link>
        </nav>
      </React.Fragment>
    );
  }
}
 
export default Header;
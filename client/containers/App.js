import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { RouteTransition } from 'react-router-transition';

import Header from '../components/admin-lte/Header.js';
import Sidebar from '../components/admin-lte/Sidebar.js';
import RightSidebar from '../components/admin-lte/RightSidebar.js';
import Footer from '../components/admin-lte/Footer.js';
import Notifications from './Notifications';
import { emitProfileRequest, consumeNotification } from '../actions/appActions';

import { getActivePermissions } from '../actions/permissionActions'; // activeAccount

function mapStateToProps(state) {
  // Select emails from activePermissions

  const activePermissionsEmails = state.activePermissions.activePermissions.map(x => ({ email: x.toUserEmail, id: x.id }));

  return {
    user: state.profile.user,
    ws_notification: state.profile.ws_notification,

    isGettingActivePermissions: state.activePermissions.isGetting,
    activePermissionsEmails
  };
}

@connect(mapStateToProps, { emitProfileRequest, consumeNotification, getActivePermissions })
export default class App extends Component {

  static propTypes = {
    children: PropTypes.element.isRequired,
    // redux
    user: PropTypes.object,
    ws_notification: PropTypes.array.isRequired,
    isGettingActivePermissions: PropTypes.bool.isRequired,
    activePermissionsEmails: PropTypes.array.isRequired,
    // actions
    emitProfileRequest: PropTypes.func.isRequired,
    consumeNotification: PropTypes.func.isRequired,
    getActivePermissions: PropTypes.func.isRequired,
    // router
    route: React.PropTypes.object,
    location: React.PropTypes.object
  }

  static contextTypes = {
    router: React.PropTypes.object
  }

  componentWillMount() {
    this.props.emitProfileRequest();
  }

  componentDidMount() {
    if (!this.props.activePermissionsEmails.length) {
      this.props.getActivePermissions();
    }
  }

  render() {
    const { isGettingActivePermissions, activePermissionsEmails } = this.props;
    return (
      <div className="wrapper">
        <Header user={this.props.user} ws_notification={this.props.ws_notification} consumeNotification={this.props.consumeNotification} />
        <Sidebar user={this.props.user} />

        <div className="content-wrapper">
          <RouteTransition
            pathname={this.props.location.pathname}
            atEnter={{ opacity: 0 }}
            atLeave={{ opacity: 2 }}
            atActive={{ opacity: 1 }}
            mapStyles={styles => styles.opacity > 1 ? { "display": "none" } : { "opacity": styles.opacity }} >
            {this.props.children}
          </RouteTransition>
        </div>

        <Notifications />
        <Footer />
        <RightSidebar isGettingActivePermissions={isGettingActivePermissions} activePermissionsEmails={activePermissionsEmails} />
        <div className="control-sidebar-bg" />
      </div>
    );
  }
}

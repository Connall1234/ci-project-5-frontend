// components/ProtectedRoute.js
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useCurrentUser } from '../contexts/CurrentUserContext'; 

//We are using this component to stop other users from accessing the wrong page 
const ProtectedRoute = ({ component: Component, roles = [], ...rest }) => {
  const currentUser = useCurrentUser();

  return (
    <Route
      {...rest}
      render={props =>
        currentUser && (roles.length === 0 || roles.includes(currentUser.role)) ? (
          <Component {...props} />
        ) : (
          <Redirect to="/signin" />
        )
      }
    />
  );
};

export default ProtectedRoute;

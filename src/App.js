import React, { useState, useEffect } from "react";
import styles from "./App.module.css";
import loadingStyles from "./styles/Loading.module.css";
import NavBar from "./components/NavBar";
import Container from "react-bootstrap/Container";
import { Route, Switch, Redirect } from "react-router-dom";
import "./api/axiosDefaults";
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
import CreateTask from "./pages/tasks/CreateTask";
import EditTask from "./pages/tasks/EditTask";
import CalendarView from "./pages/home/CalendarView";
import DayView from "./components/DayView";
import ViewTask from "./pages/tasks/ViewTask";
import Profile from "./components/Profile";
import EditProfilePage from "./pages/profile/EditProfilePage";
import RewardsPage from "./components/RewardsPage";
import { useCurrentUser } from "./contexts/CurrentUserContext";
import About from "./pages/home/About";
import ProtectedRoute from "./components/ProtectedRoute"; 

function App() {
  const currentUser = useCurrentUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [currentUser]);

  if (loading) {
    return (
      <div className={loadingStyles.LoadingContainer}>
        <div className={loadingStyles.Spinner}></div>
        <p className={loadingStyles.LoadingText}>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.App}>
      <NavBar />
      <Container className={styles.Main}>
        <Switch>
          <Route exact path="/">
            {currentUser ? <CalendarView /> : <Redirect to="/signin" />}
          </Route>

          <Route exact path="/signin">
            {currentUser ? <Redirect to="/" /> : <SignInForm />}
          </Route>
          <Route exact path="/signup">
            {currentUser ? <Redirect to="/" /> : <SignUpForm />}
          </Route>
          <Route exact path="/aboutus" component={About} />
          <ProtectedRoute exact path="/tasks/create" component={CreateTask} />
          <ProtectedRoute exact path="/tasks/:id/edit" component={EditTask} />
          <ProtectedRoute exact path="/tasks/view/:id" component={ViewTask} />
          <ProtectedRoute exact path="/day-view" component={DayView} />
          <ProtectedRoute exact path="/profiles/:id/edit" component={EditProfilePage} />
          <ProtectedRoute path="/profiles/:id/rewards" component={RewardsPage} />
          <ProtectedRoute path="/profiles/:id" component={Profile} />

          <Route render={() => <p>Page not found!</p>} />
        </Switch>
      </Container>
    </div>
  );
}

export default App;

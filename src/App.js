import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import Container from "react-bootstrap/Container";
import { Route, Switch } from "react-router-dom";
import "./api/axiosDefaults";
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
//import HomePage from "./pages/home/HomePage";
import CreateTask from "./pages/tasks/CreateTask";
import EditTask from "./pages/tasks/EditTask";
import CalendarView from "./pages/home/CalendarView";
import DayView from "./components/DayView";
import ViewTask from "./pages/tasks/ViewTask"; // Import ViewTask component
import Profile from "./components/Profile";
import TaskDisplay from "./components/TaskDisplay"
import EditProfilePage from "./pages/profile/EditProfilePage";

function App() {
  return (
    <div className={styles.App}>
      <NavBar />
      <Container className={styles.Main}>
        <Switch>
          <Route exact path="/" component={CalendarView} />
          <Route exact path="/12" component={TaskDisplay} />

          <Route exact path="/signin" component={SignInForm} />
          <Route exact path="/signup" component={SignUpForm} />
          <Route exact path="/tasks/create" component={CreateTask} />
          <Route exact path="/tasks/:id/edit" component={EditTask} />
          <Route exact path="/tasks/view/:id" component={ViewTask} /> 
          <Route exact path="/day-view" component={DayView} /> 
          <Route exact path="/profiles/:id/edit" component={EditProfilePage} />

          <Route path="/profiles/:id" component={Profile} />


          <Route render={() => <p>Page not found!</p>} />
        </Switch>
      </Container>
    </div>
  );
}

export default App;

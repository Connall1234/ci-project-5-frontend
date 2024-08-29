import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import {
  Form,
  Button,
  Image,
  Col,
  Row,
  Container,
  Alert,
} from "react-bootstrap";
import styles from "../../styles/SignUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";

const SignUpForm = () => {
  // State to manage the form data: username, password, and confirm password
  const [signUpData, setSignUpData] = useState({
    username: "",
    password1: "",
    password2: "",
  });
  
  const { username, password1, password2 } = signUpData; // Destructure the state values
  const [errors, setErrors] = useState({}); // State to handle and display form errors
  const history = useHistory(); // Hook to navigate programmatically

  // Function to handle input changes
  const handleChange = (event) => {
    setSignUpData({
      ...signUpData, // Spread the current signUpData
      [event.target.name]: event.target.value, // Update the specific input field
    });
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    try {
      // Send a POST request to the registration endpoint with the sign-up data
      await axios.post("/dj-rest-auth/registration/", signUpData);
      history.push("/signin"); // Redirect to the sign-in page after successful registration
    } catch (err) {
      // If there's an error, set the error messages in state
      setErrors(err.response?.data);
    }
  };

  return (
    <Container fluid className="p-0">
      <Row className="no-gutters align-items-center">
        <Col
          md={6}
          className={`d-flex align-items-center justify-content-center ${styles.FormCol}`}
        >
          <Container className={`${appStyles.Content} p-4`}>
            <h1 className={styles.Header}>Sign Up To OnTrack, For Daily Organizing</h1>
            
            {/* Sign-Up Form */}
            <Form onSubmit={handleSubmit}>
              {/* Username Input Field */}
              <Form.Group controlId="username">
                <Form.Label className="sr-only">Username</Form.Label>
                <Form.Control
                  className={styles.Input}
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={username} // Bind the input field value to the username state
                  onChange={handleChange} // Handle changes in the input field
                  required // Make the input field required
                />
              </Form.Group>
              {/* Display username-related error messages */}
              {errors.username?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                  {message}
                </Alert>
              ))}

              {/* Password Input Field */}
              <Form.Group controlId="password1">
                <Form.Label className="sr-only">Password</Form.Label>
                <Form.Control
                  className={styles.Input}
                  type="password"
                  placeholder="Password"
                  name="password1"
                  value={password1} // Bind the input field value to the password1 state
                  onChange={handleChange} // Handle changes in the input field
                  required // Make the input field required
                />
              </Form.Group>
              {/* Display password1-related error messages */}
              {errors.password1?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                  {message}
                </Alert>
              ))}

              {/* Confirm Password Input Field */}
              <Form.Group controlId="password2">
                <Form.Label className="sr-only">Confirm Password</Form.Label>
                <Form.Control
                  className={styles.Input}
                  type="password"
                  placeholder="Confirm Password"
                  name="password2"
                  value={password2} // Bind the input field value to the password2 state
                  onChange={handleChange} // Handle changes in the input field
                  required // Make the input field required
                />
              </Form.Group>
              {/* Display password2-related error messages */}
              {errors.password2?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                  {message}
                </Alert>
              ))}

              {/* Submit Button */}
              <Button
                className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright} w-100`}
                type="submit"
              >
                Sign Up
              </Button>

              {/* Display non-field related error messages (e.g., general registration failure) */}
              {errors.non_field_errors?.map((message, idx) => (
                <Alert key={idx} variant="warning" className="mt-3">
                  {message}
                </Alert>
              ))}
            </Form>

            {/* Link to the Sign-In Page */}
            <Row className="no-gutters m-1">
              <Col className={"d-flex align-items-center justify-content-center"}>
                <Link className={styles.Link} to="/signin">
                  Already have an account? <span>Sign In</span>
                </Link>
              </Col>
            </Row>

            {/* Link to the About Us Page */}
            <Row>
              <Col className={"d-flex align-items-center justify-content-center"}>
                <Link className={styles.Link} to="/aboutus">
                  Click here to learn more about us!
                </Link>
              </Col>
            </Row>
          </Container>
        </Col>

        {/* Right side image, displayed only on medium and larger screens */}
        <Col
          md={6}
          className={`d-none d-md-flex align-items-center justify-content-center ${styles.ImageCol}`}
        >
          <Image
            className={`${appStyles.FillerImage} img-fluid`}
            src="https://logowik.com/content/uploads/images/calendar5662.jpg"
            alt="Calendar"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default SignUpForm;

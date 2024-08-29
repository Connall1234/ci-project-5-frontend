import React, { useState } from "react";
import axios from "axios";
import { Form, Alert, Button, Col, Row, Image, Container } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import styles from "../../styles/SignInForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";

function SignInForm() {
  const setCurrentUser = useSetCurrentUser(); // Hook to update the current user context upon successful login
  const [signInData, setSignInData] = useState({
    username: "", // State to store the username
    password: "", // State to store the password
  });
  const { username, password } = signInData; // Destructure the state for easy access
  const [errors, setErrors] = useState({}); // State to store any errors returned by the API
  const history = useHistory(); // Hook to navigate programmatically after login

  // Handles form submission
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent form's default submit behavior
    try {
      // Send a POST request to the login endpoint with the sign-in data
      const { data } = await axios.post("/dj-rest-auth/login/", signInData);
      setCurrentUser(data.user); // Set the current user data in the context
      history.push("/"); // Navigate to the homepage after successful login
    } catch (err) {
      // If there's an error, set the error messages in state
      setErrors(err.response?.data);
    }
  };

  // Handles input changes
  const handleChange = (event) => {
    // Update the signInData state with the new input values
    setSignInData({
      ...signInData, // Spread the current sign-in data
      [event.target.name]: event.target.value, // Update the specific field (username or password)
    });
  };

  return (
    <Container fluid className={`p-0 ${styles.SignInContainer}`}>
      <Row className="no-gutters align-items-stretch">
        <Col md={6} className={`d-flex align-items-center justify-content-center ${styles.FormCol}`}>
          <Container className={`${appStyles.Content} p-4`}>
            <h1 className={styles.Header}>Sign In To OnTrack, For Daily Organizing</h1>
            <Form onSubmit={handleSubmit}>
              {/* Username Input Field */}
              <Form.Group controlId="username">
                <Form.Label className="sr-only">Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Username"
                  name="username"
                  className={styles.Input}
                  value={username} // Bind the input field value to the username state
                  onChange={handleChange} // Handle changes in the input field
                  required // Make the input field required
                />
              </Form.Group>
              {/* Display username-related error messages */}
              {errors.username?.map((message, idx) => (
                <Alert key={idx} variant="warning">
                  {message}
                </Alert>
              ))}

              {/* Password Input Field */}
              <Form.Group controlId="password">
                <Form.Label className="sr-only">Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  className={styles.Input}
                  value={password} // Bind the input field value to the password state
                  onChange={handleChange} // Handle changes in the input field
                  required // Make the input field required
                />
              </Form.Group>
              {/* Display password-related error messages */}
              {errors.password?.map((message, idx) => (
                <Alert key={idx} variant="warning">
                  {message}
                </Alert>
              ))}

              {/* Submit Button */}
              <Button
                className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright} w-100`}
                type="submit"
              >
                Sign In
              </Button>

              {/* Display non-field related error messages (e.g., general login failure) */}
              {errors.non_field_errors?.map((message, idx) => (
                <Alert key={idx} variant="warning" className="mt-3">
                  {message}
                </Alert>
              ))}
            </Form>

            {/* Link to the Sign-Up Page */}
            <Row className="no-gutters m-1">
              <Col className={"d-flex align-items-center justify-content-center"}>
                <Link className={styles.Link} to="/signup">
                  Don't have an account? <span>Sign up now!</span>
                </Link>
              </Col>
            </Row>

            {/* Link to the About Us Page */}
            <Row className="no-gutters m-1">
              <Col className={"d-flex align-items-center justify-content-center"}>
                <Link className={styles.Link} to="/aboutus">
                  Click here to learn more about us!
                </Link>
              </Col>
            </Row>

          </Container>
        </Col>

        {/* Right side image, displayed only on medium and larger screens */}
        <Col md={6} className={`d-none d-md-flex align-items-center justify-content-center ${styles.ImageCol}`}>
          <Image
            className={`${appStyles.FillerImage} img-fluid`}
            src="https://logowik.com/content/uploads/images/calendar5662.jpg" // Display an image on the right side
            alt="Calendar" // Alternative text for the image
          />
        </Col>
      </Row>
    </Container>
  );
}

export default SignInForm;

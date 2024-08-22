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
  const [signUpData, setSignUpData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    password1: "",
    password2: "",
  });

  const { first_name, last_name, username, password1, password2 } = signUpData;
  const [errors, setErrors] = useState({});
  const history = useHistory();

  const handleChange = (event) => {
    setSignUpData({
      ...signUpData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("/dj-rest-auth/registration/", signUpData);
      history.push("/signin");
    } catch (err) {
      setErrors(err.response?.data);
    }
  };

  return (
    <Container fluid className="p-0">
      <Row className=" no-gutters align-items-center">
        <Col
          md={6}
          className={`d-flex align-items-center justify-content-center ${styles.FormCol}`}
        >
          <Container className={`${appStyles.Content} p-4`}>
            <h1 className={styles.Header}>Sign Up To OnTrack, For Daily Organizing</h1>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="first_name">
                <Form.Label className="sr-only">First Name</Form.Label>
                <Form.Control
                  className={styles.Input}
                  type="text"
                  placeholder="First Name"
                  name="first_name"
                  value={first_name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="last_name">
                <Form.Label className="sr-only">Last Name</Form.Label>
                <Form.Control
                  className={styles.Input}
                  type="text"
                  placeholder="Last Name"
                  name="last_name"
                  value={last_name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group controlId="username">
                <Form.Label className="sr-only">Username</Form.Label>
                <Form.Control
                  className={styles.Input}
                  type="text"
                  placeholder="Username"
                  name="username"
                  value={username}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              {errors.username?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                  {message}
                </Alert>
              ))}
              <Form.Group controlId="password1">
                <Form.Label className="sr-only">Password</Form.Label>
                <Form.Control
                  className={styles.Input}
                  type="password"
                  placeholder="Password"
                  name="password1"
                  value={password1}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              {errors.password1?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                  {message}
                </Alert>
              ))}
              <Form.Group controlId="password2">
                <Form.Label className="sr-only">Confirm Password</Form.Label>
                <Form.Control
                  className={styles.Input}
                  type="password"
                  placeholder="Confirm Password"
                  name="password2"
                  value={password2}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              {errors.password2?.map((message, idx) => (
                <Alert variant="warning" key={idx}>
                  {message}
                </Alert>
              ))}
              <Button
                className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright} w-100`}
                type="submit"
              >
                Sign Up
              </Button>
              {errors.non_field_errors?.map((message, idx) => (
                <Alert key={idx} variant="warning" className="mt-3">
                  {message}
                </Alert>
              ))}
            </Form>
            <Row className="no-gutters m-1">
              <Col
                className={"d-flex align-items-center justify-content-center"}
              >
                <Link className={styles.Link} to="/signin">
                  Already have an account? <span>Sign In</span>
                </Link>
              </Col>
            </Row>
            <Row>
              <Col
                className={"d-flex align-items-center justify-content-center"}
              >
                <Link className={styles.Link} to="/aboutus">
                  Click here to learn more about us!
                </Link>
              </Col>
            </Row>
          </Container>
        </Col>
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

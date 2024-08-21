import React, { useState } from "react";
import axios from "axios";
import { Form, Alert, Button, Col, Row, Image, Container } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import styles from "../../styles/SignInUpForm.module.css";
import btnStyles from "../../styles/Button.module.css";
import appStyles from "../../App.module.css";
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";

function SignInForm() {
  const setCurrentUser = useSetCurrentUser();
  const [signInData, setSignInData] = useState({
    username: "",
    password: "",
  });
  const { username, password } = signInData;
  const [errors, setErrors] = useState({});
  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post("/dj-rest-auth/login/", signInData);
      setCurrentUser(data.user);
      history.push("/");
    } catch (err) {
      setErrors(err.response?.data);
    }
  };

  const handleChange = (event) => {
    setSignInData({
      ...signInData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <Container fluid className={`p-0 ${styles.SignInContainer}`}>
      <Row className="no-gutters align-items-stretch">
        <Col md={6} className={`d-flex align-items-center justify-content-center ${styles.FormCol}`}>
          <Container className={`${appStyles.Content} p-4`}>
            <h1 className={styles.Header}>Sign In</h1>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="username">
                <Form.Label className="sr-only">Username</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Username"
                  name="username"
                  className={styles.Input}
                  value={username}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              {errors.username?.map((message, idx) => (
                <Alert key={idx} variant="warning">
                  {message}
                </Alert>
              ))}

              <Form.Group controlId="password">
                <Form.Label className="sr-only">Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  className={styles.Input}
                  value={password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              {errors.password?.map((message, idx) => (
                <Alert key={idx} variant="warning">
                  {message}
                </Alert>
              ))}
              <Button
                className={`${btnStyles.Button} ${btnStyles.Wide} ${btnStyles.Bright} w-100`}
                type="submit"
              >
                Sign In
              </Button>
              {errors.non_field_errors?.map((message, idx) => (
                <Alert key={idx} variant="warning" className="mt-3">
                  {message}
                </Alert>
              ))}
            </Form>
            <Row className="no-gutters m-1">
              <Col className={"d-flex align-items-center justify-content-center"}>
                <Link className={styles.Link} to="/signup">
                  Don't have an account? <span>Sign up now!</span>
                </Link>
              </Col>
            </Row>

          </Container>
        </Col>
        <Col md={6} className={`d-none d-md-flex align-items-center justify-content-center ${styles.ImageCol}`}>
          <Image
            className={`${appStyles.FillerImage} img-fluid`}
            src="https://logowik.com/content/uploads/images/calendar5662.jpg"
            alt="Calendar"
          />
        </Col>
      </Row>
    </Container>
  );
}

export default SignInForm;

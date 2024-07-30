import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, Container, Alert, Modal } from "react-bootstrap";
import axios from "axios";
import { useHistory, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/CreateTask.module.css" // Import custom CSS

function CreateTask() {
  const [errors, setErrors] = useState({});
  const [postData, setPostData] = useState({
    title: "",
    description: "",
    start_date: new Date(),
    priority: "M", // Default priority
    category: "O", // Default category
  });

  const [showPastDateConfirmation, setShowPastDateConfirmation] = useState(false);
  const [formFilled, setFormFilled] = useState(false);

  const history = useHistory();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.date) {
      setPostData((prevData) => ({
        ...prevData,
        start_date: new Date(location.state.date),
      }));
    }
  }, [location.state]);

  const { title, description, start_date, priority, category } = postData;

  useEffect(() => {
    // Check if all required fields are filled
    if (title && start_date) {
      setFormFilled(true);
    } else {
      setFormFilled(false);
    }
  }, [title, start_date]);

  const handleChange = (event) => {
    setPostData({
      ...postData,
      [event.target.name]: event.target.value,
    });
  };

  const handleStartDateChange = (date) => {
    setPostData({
      ...postData,
      start_date: date,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if start_date is yesterday or earlier
    if (start_date < new Date().setHours(0, 0, 0, 0) - 86400000) {
      setShowPastDateConfirmation(true);
      return;
    }

    await createTask();
  };

  const createTask = async () => {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("start_date", start_date.toISOString());
    formData.append("priority", priority);
    formData.append("category", category);

    try {
      await axios.post(
        "https://project-5-backend-api-connall-3eb143768597.herokuapp.com/tasks/",
        formData
      );

      history.push("/");
    } catch (err) {
      console.log(err.response.data);

      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  const handleConfirmationYes = async () => {
    setShowPastDateConfirmation(false);
    await createTask();
  };

  const handleConfirmationNo = () => {
    setShowPastDateConfirmation(false);
  };

  return (
    <Container className="mt-4 create-task-container">
      <h1 className="text-center mb-4">Create Task</h1>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={title}
                onChange={handleChange}
                required
              />
            </Form.Group>
            {errors?.title?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                name="description"
                value={description}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Start Date</Form.Label>
              <br />
              <DatePicker
                selected={start_date}
                onChange={handleStartDateChange}
                showTimeSelect
                dateFormat="Pp"
                className="form-control"
                required
              />
            </Form.Group>
            {errors?.start_date?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Priority</Form.Label>
              <Form.Control
                as="select"
                name="priority"
                value={priority}
                onChange={handleChange}
                required
              >
                <option value="L">Low</option>
                <option value="M">Medium</option>
                <option value="H">High</option>
              </Form.Control>
            </Form.Group>
            {errors?.priority?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                name="category"
                value={category}
                onChange={handleChange}
                required
              >
                <option value="W">Work</option>
                <option value="P">Personal</option>
                <option value="O">Other</option>
              </Form.Control>
            </Form.Group>
            {errors?.category?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}
            <div className="d-flex justify-content-between mt-4">
              <Button variant="secondary" onClick={() => history.goBack()}>
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={!formFilled}>
                Create
              </Button>
            </div>
          </Col>
        </Row>
      </Form>

      <Modal show={showPastDateConfirmation} onHide={handleConfirmationNo}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Past Date</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You are creating a task for a past date. Are you sure you want to proceed?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleConfirmationNo}>
            No
          </Button>
          <Button variant="primary" onClick={handleConfirmationYes}>
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default CreateTask;

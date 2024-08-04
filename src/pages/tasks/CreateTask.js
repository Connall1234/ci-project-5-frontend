import React, { useState, useEffect } from "react";
import { Form, Button, Container, Alert, Row, Col } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useHistory, useLocation } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import moment from "moment";
import "../../styles/CreateTask.module.css"; // Make sure to adjust the path as needed

function CreateTask() {
  const [errors, setErrors] = useState({});
  const [isPastDate, setIsPastDate] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [postData, setPostData] = useState({
    title: "",
    description: "",
    start_date: new Date(),
    priority: "M", // Default
    category: "O", // Default
  });

  const { title, description, start_date, priority, category } = postData;
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

  useEffect(() => {
    // Check if start_date is in the past
    const today = moment().startOf("day");
    const taskStartDate = moment(start_date).startOf("day");
    setIsPastDate(taskStartDate.isBefore(today));
  }, [start_date]);

  const handleChange = (event) => {
    setPostData({
      ...postData,
      [event.target.name]: event.target.value,
    });
  };

  const handleDateChange = (date) => {
    setPostData({
      ...postData,
      start_date: date,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title || !start_date) {
      setErrors({ general: ["Please fill in all required fields."] });
      return;
    }

    if (isPastDate) {
      setShowConfirmation(true);
    } else {
      submitTask();
    }
  };

  const submitTask = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("start_date", moment(start_date).format("YYYY-MM-DD")); // Format for backend with no time
    formData.append("priority", priority);
    formData.append("category", category);

    try {
      await axiosReq.post("/tasks/", formData);
      history.push("/");
    } catch (err) {
      console.log(err);
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  return (
    <Container className="mt-4 create-task-container">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <h1 className="text-center mb-4">Create Task</h1>
          <Form onSubmit={handleSubmit}>
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
            {errors?.description?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}

            <Form.Group>
              <Form.Label>Start Date</Form.Label>
              <DatePicker
                selected={start_date}
                onChange={handleDateChange}
                dateFormat="yyyy-MM-dd"
                className="form-control"
              />
              {isPastDate && (
                <Alert variant="warning" className="mt-2">
                  This is a task in the past. Are you sure you want to create it?
                </Alert>
              )}
            </Form.Group>
            {errors?.start_date?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}

            <Form.Group>
              <Form.Label>Priority</Form.Label>
              <Form.Control
                as="select"
                name="priority"
                value={priority}
                onChange={handleChange}
              >
                <option value="L">Low</option>
                <option value="M">Medium</option>
                <option value="H">High</option>
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Control
                as="select"
                name="category"
                value={category}
                onChange={handleChange}
              >
                <option value="W">Work</option>
                <option value="P">Personal</option>
                <option value="O">Other</option>
              </Form.Control>
            </Form.Group>

            {errors?.general?.map((message, idx) => (
              <Alert variant="warning" key={idx}>
                {message}
              </Alert>
            ))}

            <div className="d-flex justify-content-between mt-4">
              <Button variant="secondary" onClick={() => history.goBack()} className="mr-2">
                Cancel
              </Button>
              <Button type="submit" variant="primary" className="ml-2">
                Create
              </Button>
            </div>

            {showConfirmation && (
              <div className="mt-3">
                <Alert variant="warning">
                  Are you sure you want to create a task in the past?
                  <div className="d-flex justify-content-between mt-2">
                    <Button
                      variant="warning"
                      onClick={() => {
                        setShowConfirmation(false);
                        submitTask();
                      }}
                    >
                      Yes
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => setShowConfirmation(false)}
                    >
                      No
                    </Button>
                  </div>
                </Alert>
              </div>
            )}
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default CreateTask;

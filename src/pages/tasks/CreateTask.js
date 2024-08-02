import React, { useState, useEffect } from "react";
import { Form, Button, Container, Alert } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useHistory, useLocation } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";
import moment from "moment";

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

  const handleChange = (event) => {
    setPostData({
      ...postData,
      [event.target.name]: event.target.value,
    });
  };

  const handleDateChange = (date, name) => {
    setPostData({
      ...postData,
      [name]: date,
    });

    // Check if start_date is in the past when date changes
    const today = moment().startOf("day");
    const taskStartDate = moment(date).startOf("day");
    setIsPastDate(taskStartDate.isBefore(today));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // CFill in fields
    if (!title || !start_date) {
      setErrors({ general: ["Please fill in all required fields."] });
      return;
    }

    // Display confirmation if the date is in the past
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
      <h1 className="text-center mb-4">Create Task</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={title}
            onChange={handleChange}
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
            onChange={(date) => handleDateChange(date, "start_date")}
            dateFormat="yyyy-MM-dd"
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

        <Button onClick={() => history.goBack()}>Cancel</Button>
        <Button type="submit">Create</Button>

        {showConfirmation && (
          <div className="mt-3">
            <Alert variant="warning">
              Are you sure you want to create a task in the past?
              <Button
                className="ml-2"
                variant="warning"
                onClick={() => {
                  setShowConfirmation(false);
                  submitTask();
                }}
              >
                Yes
              </Button>
              <Button
                className="ml-2"
                variant="secondary"
                onClick={() => setShowConfirmation(false)}
              >
                No
              </Button>
            </Alert>
          </div>
        )}
      </Form>
    </Container>
  );
}

export default CreateTask;

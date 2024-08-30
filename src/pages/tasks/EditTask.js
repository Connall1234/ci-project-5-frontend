import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";

function EditTask() {
  // State to manage validation errors
  const [errors, setErrors] = useState({});
  // State to check if the selected date is in the past
  const [isPastDate, setIsPastDate] = useState(false);
  // State to show or hide the confirmation alert before updating
  const [showConfirmation, setShowConfirmation] = useState(false);
  // State to manage loading state
  const [loading, setLoading] = useState(true);

  // State to hold the task data
  const [postData, setPostData] = useState({
    title: "",
    description: "",
    start_date: new Date(),
    priority: "M",
    category: "O",
  });

  const { title, description, start_date, priority, category } = postData;
  const history = useHistory(); // Hook to navigate programmatically
  const { id } = useParams(); // Hook to get the task ID from URL parameters

  // Effect to fetch the task data when the component mounts or ID changes
  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const { data } = await axiosReq.get(`/tasks/${id}`);
        const fetchedStartDate = moment(data.start_date).toDate();

        // Set fetched data into state
        setPostData({
          title: data.title,
          description: data.description,
          start_date: fetchedStartDate,
          priority: data.priority,
          category: data.category,
        });

        // Check if the fetched start date is before today's date
        const today = moment().startOf("day");
        const taskStartDate = moment(fetchedStartDate).startOf("day");
        setIsPastDate(taskStartDate.isBefore(today));
      } catch (err) {
        console.log(err); // Handle errors (e.g., network issues)
      } finally {
        setLoading(false); // Set loading state to false after data is fetched
      }
    };

    fetchTaskData();
  }, [id]);

  // Effect to scroll to the bottom when confirmation is shown
  useEffect(() => {
    if (showConfirmation) {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [showConfirmation]);

  // Handler for input field changes
  const handleChange = (event) => {
    setPostData({
      ...postData,
      [event.target.name]: event.target.value,
    });
  };

  // Handler for date picker changes
  const handleDateChange = (date) => {
    setPostData({
      ...postData,
      start_date: date,
    });

    // Update isPastDate state based on the new date
    const today = moment().startOf("day");
    const taskStartDate = moment(date).startOf("day");
    setIsPastDate(taskStartDate.isBefore(today));
  };

  // Handler for form submission
  const handleSubmit = (event) => {
    event.preventDefault();

    // Check for required fields
    if (!title || !start_date) {
      setErrors({ general: ["Please fill in all required fields."] });
      return;
    }

    // Show confirmation alert before making the update
    setShowConfirmation(true);
  };

  // Confirm update and make the PUT request to update task data
  const confirmUpdate = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("start_date", moment(start_date).format("YYYY-MM-DD"));
    formData.append("priority", priority);
    formData.append("category", category);

    try {
      await axiosReq.put(`/tasks/${id}/`, formData);
      history.push("/"); // Navigate to the home page after successful update
    } catch (err) {
      console.log(err); // Handle errors during the update
      if (err.response?.status !== 401) {
        setErrors(err.response?.data); // Set validation errors from server response
      }
    }
  };

  return (
    <Container className="mt-4 edit-task-container">
      <h1 className="text-center mb-4">Edit Task</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={title}
            onChange={handleChange}
            required
            maxLength={15}
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
          <div>
          {!loading && (
            <DatePicker
              selected={start_date}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
              className="form-control"
            />
          )}
          </div>
          {isPastDate && (
            <Alert variant="warning" className="mt-2">
              This is a task in the past. Are you sure you want to update it?
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
          <Button variant="secondary" onClick={() => history.goBack()}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Update
          </Button>
        </div>

        {showConfirmation && (
          <div className="mt-3">
            <Alert variant="warning">
              Are you sure you want to update this task?
              <div className="d-flex justify-content-between mt-2">
                <Button
                  className="ml-2"
                  variant="warning"
                  onClick={() => {
                    setShowConfirmation(false);
                    confirmUpdate();
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
              </div>
            </Alert>
          </div>
        )}
      </Form>
    </Container>
  );
}

export default EditTask;

import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { Form, Button, Container, Alert } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";

function EditTask() {
  const [errors, setErrors] = useState({});
  const [isPastDate, setIsPastDate] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(true);

  const [postData, setPostData] = useState({
    title: "",
    description: "",
    start_date: new Date(),
    priority: "M",
    category: "O",
  });

  const { title, description, start_date, priority, category } = postData;
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const { data } = await axiosReq.get(`/tasks/${id}`);
        const fetchedStartDate = moment(data.start_date).toDate();

        setPostData({
          title: data.title,
          description: data.description,
          start_date: fetchedStartDate,
          priority: data.priority,
          category: data.category,
        });

        const today = moment().startOf("day");
        const taskStartDate = moment(fetchedStartDate).startOf("day");
        setIsPastDate(taskStartDate.isBefore(today));
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTaskData();
  }, [id]);

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

    const today = moment().startOf("day");
    const taskStartDate = moment(date).startOf("day");
    setIsPastDate(taskStartDate.isBefore(today));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title || !start_date) {
      setErrors({ general: ["Please fill in all required fields."] });
      return;
    }

    setShowConfirmation(true);
  };

  const confirmUpdate = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("start_date", moment(start_date).format("YYYY-MM-DD"));
    formData.append("priority", priority);
    formData.append("category", category);

    try {
      await axiosReq.put(`/tasks/${id}`, formData);
      history.push("/");
    } catch (err) {
      console.log(err);
      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
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
          {!loading && (
            <DatePicker
              selected={start_date}
              onChange={handleDateChange}
              dateFormat="yyyy-MM-dd"
            />
          )}
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
            </Alert>
          </div>
        )}
      </Form>
    </Container>
  );
}

export default EditTask;

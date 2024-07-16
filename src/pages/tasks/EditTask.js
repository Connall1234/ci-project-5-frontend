import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import { useHistory, useParams } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";

function EditTask() {
  const [errors, setErrors] = useState({});
  const [isPastDate, setIsPastDate] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const [postData, setPostData] = useState({
    title: "",
    description: "",
    start_date: new Date(),
    end_date: new Date(),
    priority: "M", // Default priority
    category: "O", // Default category
  });

  const { title, description, start_date, end_date, priority, category } = postData;
  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/tasks/${id}`);
        const { title, description, start_date, end_date, priority, category } = data;

        setPostData({
          title,
          description,
          start_date: moment(start_date).toDate(),
          end_date: moment(end_date).toDate(),
          priority,
          category,
        });

        // Check if start_date is in the past (excluding today)
        const today = moment().startOf("day");
        const taskStartDate = moment(start_date).startOf("day");
        setIsPastDate(taskStartDate.isBefore(today));
      } catch (err) {
        console.log(err);
      }
    };

    handleMount();
  }, [id]);

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate mandatory fields
    if (!title || !start_date || !end_date) {
      setErrors({ general: ["Please fill in all required fields."] });
      return;
    }

    setShowConfirmation(true); // Show confirmation dialog before submitting
  };

  const confirmUpdate = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("start_date", moment(start_date).format("YYYY-MM-DD HH:mm:ss")); // Format for backend with time
    formData.append("end_date", moment(end_date).format("YYYY-MM-DD HH:mm:ss")); // Format for backend with time
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
    <Form onSubmit={handleSubmit}>
      <Container>
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
          <Form.Label>Start Date & Time</Form.Label>
          <DatePicker
            selected={start_date}
            onChange={(date) => handleDateChange(date, "start_date")}
            dateFormat="yyyy-MM-dd HH:mm"
            showTimeSelect
            timeFormat="HH:mm"
          />
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
          <Form.Label>End Date & Time</Form.Label>
          <DatePicker
            selected={end_date}
            onChange={(date) => handleDateChange(date, "end_date")}
            dateFormat="yyyy-MM-dd HH:mm"
            showTimeSelect
            timeFormat="HH:mm"
          />
        </Form.Group>
        {errors?.end_date?.map((message, idx) => (
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
        <Button type="submit">Update</Button>

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
      </Container>
    </Form>
  );
}

export default EditTask;

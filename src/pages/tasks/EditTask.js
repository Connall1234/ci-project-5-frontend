import React, { useEffect, useState } from "react";
import { startOfWeek } from 'date-fns';
import { differenceInHours } from 'date-fns';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

import { useHistory, useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";

function EditTask() {
  const [errors, setErrors] = useState({});

  const [postData, setPostData] = useState({
    title: "",
    description: "",
    start_date: new Date(),
    end_date: new Date(),
  });
  const { title, description, start_date, end_date } = postData;

  const history = useHistory();
  const { id } = useParams();

  useEffect(() => {
    const handleMount = async () => {
      try {
        const { data } = await axiosReq.get(`/tasks/${id}`);
        const { title, description, start_date, end_date } = data;

        // Convert the date strings from the backend to Date objects
        setPostData({
          title,
          description,
          start_date: moment(start_date, "DD MMM YYYY").toDate(),
          end_date: moment(end_date, "DD MMM YYYY").toDate(),
        });
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
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("start_date", moment(start_date).format("DD MMM YYYY"));
    formData.append("end_date", moment(end_date).format("DD MMM YYYY"));

    try {
      await axiosReq.put(`/tasks/${id}`, formData);
      history.push(`/tasks/${id}`);
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
          <Form.Label>Start Date</Form.Label>
          <DatePicker
            selected={start_date}
            onChange={(date) => handleDateChange(date, "start_date")}
            dateFormat="yyyy-MM-dd"
          />
        </Form.Group>
        {errors?.start_date?.map((message, idx) => (
          <Alert variant="warning" key={idx}>
            {message}
          </Alert>
        ))}

        <Form.Group>
          <Form.Label>End Date</Form.Label>
          <DatePicker
            selected={end_date}
            onChange={(date) => handleDateChange(date, "end_date")}
            dateFormat="yyyy-MM-dd"
          />
        </Form.Group>
        {errors?.end_date?.map((message, idx) => (
          <Alert variant="warning" key={idx}>
            {message}
          </Alert>
        ))}

        <Button onClick={() => history.goBack()}>Cancel</Button>
        <Button type="submit">Update</Button>
      </Container>
    </Form>
  );
}

export default EditTask;

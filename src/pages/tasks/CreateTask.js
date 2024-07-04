import React, { useState } from "react";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import axios from "axios";


import { useHistory } from "react-router";
//import { axiosReq } from "../../api/axiosDefaults";

function CreateTask() {
  const [errors, setErrors] = useState({});

  const [postData, setPostData] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",


  });
  const { title, description, start_date, end_date } = postData;

  const history = useHistory();

  const handleChange = (event) => {
    setPostData({
      ...postData,
      [event.target.name]: event.target.value,
    });
  };

 

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    formData.append("title", title);
    formData.append("description", description);
    formData.append("start_date", start_date);
    formData.append("end_date", end_date);


    try {
      //const { data } = 
      //await axiosReq.post("/tasks/", formData);
      await axios.post("https://project-5-backend-api-connall-3eb143768597.herokuapp.com/tasks/", formData);

      
      history.push('/');
      console.log(formData)
      //history.push(`/tasks/${data.id}`);
    } catch (err) {
        console.log(err.response.data); // Correct way to access error response data
        console.log("Error occurred while creating task");

      if (err.response?.status !== 401) {
        setErrors(err.response?.data);
      }
    }
  };

  const textFields = (
    <div className="text-center">
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
          type="textarea"
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
        <Form.Control
          type="date"
          rows={6}
          name="start_date"
          value={start_date}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.start_date?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>

      ))}
      <Form.Group>
        <Form.Label>End Date</Form.Label>
        <Form.Control
          type="date"
          rows={6}
          name="end_date"
          value={end_date}
          onChange={handleChange}
        />
      </Form.Group>
      {errors?.end_date?.map((message, idx) => (
        <Alert variant="warning" key={idx}>
          {message}
        </Alert>

      ))}

      <Button
        
        onClick={() => history.goBack()}
      >
        cancel
      </Button>
      <Button type="submit">
        create
      </Button>
    </div>
  );

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col className="py-2 p-0 p-md-2" md={7} lg={8}>
          <Container
            className={` d-flex flex-column justify-content-center`}
          >
  

            <div className="d-md-none">{textFields}</div>
          </Container>
        </Col>
        <Col md={5} lg={4} className="d-none d-md-block p-0 p-md-2">
          <Container>{textFields}</Container>
        </Col>
      </Row>
    </Form>
  );
}

export default CreateTask;
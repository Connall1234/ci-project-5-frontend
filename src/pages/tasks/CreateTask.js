// src/components/CreateTask.js
import React, { useState } from "react";
import axios from "axios";
import { Button, Form } from "react-bootstrap";
import styles from "../../styles/TaskDisplay.module.css";

const CreateTask = () => {
  const [post, setPost] = useState({
    title: "",
    description: "",
    start_date: "",
    end_date: "",
  });
  const { title, description, start_date, end_date } = post;
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState(null);

  const handleInput = (event) => {
    setPost({ ...post, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = {
      title,
      description,
      start_date,
      end_date,
    };

    try {
      const response = await axios.post(
        "https://project-5-backend-api-connall-3eb143768597.herokuapp.com/tasks/",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(response);
      setFeedback("Task created successfully!");
      setPost({
        title: "",
        description: "",
        start_date: "",
        end_date: "",
      });
    } catch (err) {
      console.error(err);
      setError(err.response ? err.response.data : "An unexpected error occurred.");
    }
  };

  return (
    <div className={styles.taskForm}>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="title">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Title"
            name="title"
            value={title}
            onChange={handleInput}
          />
        </Form.Group>
        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Form.Control
            type="text"
            placeholder="Description"
            name="description"
            value={description}
            onChange={handleInput}
          />
        </Form.Group>
        <Form.Group controlId="start_date">
          <Form.Label>Start Date</Form.Label>
          <Form.Control
            type="date"
            name="start_date"
            value={start_date}
            onChange={handleInput}
          />
        </Form.Group>
        <Form.Group controlId="end_date">
          <Form.Label>End Date</Form.Label>
          <Form.Control
            type="date"
            name="end_date"
            value={end_date}
            onChange={handleInput}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
        {feedback && <div className={styles.feedback}>{feedback}</div>}
        {error && <div className={styles.error}>{error}</div>}
      </Form>
    </div>
  );
};

export default CreateTask;

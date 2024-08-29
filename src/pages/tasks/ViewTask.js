import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import moment from "moment";

// Define mappings for priority and category codes to their full labels
const PRIORITY_LABELS = {
  L: "Low",
  M: "Medium",
  H: "High",
};

const CATEGORY_LABELS = {
  W: "Work",
  P: "Personal",
  O: "Other",
};

function ViewTask() {
  const [task, setTask] = useState(null); // State to store the fetched task data
  const [errors, setErrors] = useState({}); // State to store any errors encountered during data fetching
  const { id } = useParams(); // Extract task ID from URL parameters

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const { data } = await axiosReq.get(`/tasks/${id}`);
        setTask(data); // Store the fetched task data in state
      } catch (err) {
        console.log(err); // Log the error for debugging
        setErrors(prevErrors => ({
          ...prevErrors,
          fetch: "Failed to fetch task", // Set an error message if data fetching fails
        }));
      }
    };
    fetchTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Show a loading message while the task data is being fetched
  if (!task) return <div>Loading...</div>;

  return (
    <Container>
      <Form>
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control type="text" value={task.title} readOnly />
        </Form.Group>
        {errors?.title && <Alert variant="warning">{errors.title}</Alert>}

        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Form.Control as="textarea" rows={6} value={task.description} readOnly />
        </Form.Group>
        {errors?.description && <Alert variant="warning">{errors.description}</Alert>}

        <Form.Group>
          <Form.Label>Start Date</Form.Label>
          <Form.Control type="text" value={moment(task.start_date).format("YYYY-MM-DD")} readOnly />
        </Form.Group>
        {errors?.start_date && <Alert variant="warning">{errors.start_date}</Alert>}

        <Form.Group>
          <Form.Label>Priority</Form.Label>
          <Form.Control
            type="text"
            value={PRIORITY_LABELS[task.priority] || task.priority}
            readOnly
          />
        </Form.Group>
        {errors?.priority && <Alert variant="warning">{errors.priority}</Alert>}

        <Form.Group>
          <Form.Label>Category</Form.Label>
          <Form.Control
            type="text"
            value={CATEGORY_LABELS[task.category] || task.category}
            readOnly
          />
        </Form.Group>
        {errors?.category && <Alert variant="warning">{errors.category}</Alert>}

        <Button onClick={() => window.history.back()}>Back</Button>
      </Form>
    </Container>
  );
}

export default ViewTask;

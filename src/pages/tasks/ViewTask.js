import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { axiosReq } from "../../api/axiosDefaults";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import moment from "moment";

function ViewTask() {
  const [task, setTask] = useState(null);
  const [errors, setErrors] = useState({});
  const { id } = useParams();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const { data } = await axiosReq.get(`/tasks/${id}`);
        setTask(data);
      } catch (err) {
        console.log(err);
        setErrors(prevErrors => ({ ...prevErrors, fetch: "Failed to fetch task" }));
      }
    };
    fetchTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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

        {/* <Form.Group>
          <Form.Label>End Date</Form.Label>
          <Form.Control type="text" value={moment(task.end_date).format("YYYY-MM-DD")} readOnly />
        </Form.Group>
        {errors?.end_date && <Alert variant="warning">{errors.end_date}</Alert>} */}

        <Button onClick={() => window.history.back()}>Back</Button>
      </Form>
    </Container>
  );
}

export default ViewTask;

// had this in jsonpack     "date-fns": "^2.16.1",


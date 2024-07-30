// import React, { useState, useEffect } from "react";
// import { Form, Button, Row, Col, Container, Alert, Modal } from "react-bootstrap";
// import axios from "axios";
// import { useHistory, useLocation } from "react-router-dom";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import "../../styles/CreateTask.module.css"; // Import custom CSS

// function CreateTask() {
//   const [errors, setErrors] = useState({});
//   const [postData, setPostData] = useState({
//     title: "",
//     description: "",
//     start_date: new Date(),
//     priority: "M", // Default priority
//     category: "O", // Default category
//   });

//   const [showPastDateConfirmation, setShowPastDateConfirmation] = useState(false);
//   const [formFilled, setFormFilled] = useState(false);

//   const history = useHistory();
//   const location = useLocation();

//   useEffect(() => {
//     if (location.state && location.state.date) {
//       setPostData((prevData) => ({
//         ...prevData,
//         start_date: new Date(location.state.date),
//       }));
//     }
//   }, [location.state]);

//   const { title, description, start_date, priority, category } = postData;

//   useEffect(() => {
//     // Check if all required fields are filled
//     if (title && start_date) {
//       setFormFilled(true);
//     } else {
//       setFormFilled(false);
//     }
//   }, [title, start_date]);

//   const handleChange = (event) => {
//     setPostData({
//       ...postData,
//       [event.target.name]: event.target.value,
//     });
//   };

//   const handleStartDateChange = (date) => {
//     setPostData({
//       ...postData,
//       start_date: date,
//     });
//   };

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     // Check if start_date is yesterday or earlier
//     if (start_date < new Date().setHours(0, 0, 0, 0) - 86400000) {
//       setShowPastDateConfirmation(true);
//       return;
//     }

//     await createTask();
//   };

//   const createTask = async () => {
//     const formData = new FormData();

//     // Format the date as YYYY-MM-DD
//     const formattedDate = start_date.toISOString().split('T')[0];

//     formData.append("title", title);
//     formData.append("description", description);
//     formData.append("start_date", formattedDate); // Use the formatted date
//     formData.append("priority", priority);
//     formData.append("category", category);

//     try {
//       await axios.post(
//         "https://project-5-backend-api-connall-3eb143768597.herokuapp.com/tasks/",
//         formData
//       );

//       history.push("/");
//     } catch (err) {
//       console.log(err.response.data);

//       if (err.response?.status !== 401) {
//         setErrors(err.response?.data);
//       }
//     }
//   };

//   const handleConfirmationYes = async () => {
//     setShowPastDateConfirmation(false);
//     await createTask();
//   };

//   const handleConfirmationNo = () => {
//     setShowPastDateConfirmation(false);
//   };

//   return (
//     <Container className="mt-4 create-task-container">
//       <h1 className="text-center mb-4">Create Task</h1>
//       <Form onSubmit={handleSubmit}>
//         <Row>
//           <Col md={6}>
//             <Form.Group>
//               <Form.Label>Title</Form.Label>
//               <Form.Control
//                 type="text"
//                 name="title"
//                 value={title}
//                 onChange={handleChange}
//                 required
//               />
//             </Form.Group>
//             {errors?.title?.map((message, idx) => (
//               <Alert variant="warning" key={idx}>
//                 {message}
//               </Alert>
//             ))}
//             <Form.Group>
//               <Form.Label>Description</Form.Label>
//               <Form.Control
//                 as="textarea"
//                 rows={6}
//                 name="description"
//                 value={description}
//                 onChange={handleChange}
//               />
//             </Form.Group>
//             <Form.Group>
//               <Form.Label>Start Date</Form.Label>
//               <br />
//               <DatePicker
//                 selected={start_date}
//                 onChange={handleStartDateChange}
//                 showTimeSelect
//                 dateFormat="yyyy-MM-dd"
//                 className="form-control"
//                 required
//               />
//             </Form.Group>
//             {errors?.start_date?.map((message, idx) => (
//               <Alert variant="warning" key={idx}>
//                 {message}
//               </Alert>
//             ))}
//           </Col>
//           <Col md={6}>
//             <Form.Group>
//               <Form.Label>Priority</Form.Label>
//               <Form.Control
//                 as="select"
//                 name="priority"
//                 value={priority}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="L">Low</option>
//                 <option value="M">Medium</option>
//                 <option value="H">High</option>
//               </Form.Control>
//             </Form.Group>
//             {errors?.priority?.map((message, idx) => (
//               <Alert variant="warning" key={idx}>
//                 {message}
//               </Alert>
//             ))}
//             <Form.Group>
//               <Form.Label>Category</Form.Label>
//               <Form.Control
//                 as="select"
//                 name="category"
//                 value={category}
//                 onChange={handleChange}
//                 required
//               >
//                 <option value="W">Work</option>
//                 <option value="P">Personal</option>
//                 <option value="O">Other</option>
//               </Form.Control>
//             </Form.Group>
//             {errors?.category?.map((message, idx) => (
//               <Alert variant="warning" key={idx}>
//                 {message}
//               </Alert>
//             ))}
//             <div className="d-flex justify-content-between mt-4">
//               <Button variant="secondary" onClick={() => history.goBack()}>
//                 Cancel
//               </Button>
//               <Button variant="primary" type="submit" disabled={!formFilled}>
//                 Create
//               </Button>
//             </div>
//           </Col>
//         </Row>
//       </Form>

//       <Modal show={showPastDateConfirmation} onHide={handleConfirmationNo}>
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm Past Date</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           You are creating a task for a past date. Are you sure you want to proceed?
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleConfirmationNo}>
//             No
//           </Button>
//           <Button variant="primary" onClick={handleConfirmationYes}>
//             Yes
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// }

// export default CreateTask;
//Above works 


import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import { useHistory } from "react-router-dom";
import { axiosReq } from "../../api/axiosDefaults";

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

    // see if start_date is in the past when date changes
    const today = moment().startOf("day");
    const taskStartDate = moment(date).startOf("day");
    setIsPastDate(taskStartDate.isBefore(today));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // check mandatory fields
    if (!title || !start_date) {
      setErrors({ general: ["Please fill in all required fields."] });
      return;
    }

    // display confirmation if the date is in the past
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
    formData.append("start_date", moment(start_date).format("YYYY-MM-DD")); // Format for backend without time
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
      </Container>
    </Form>
  );
}

export default CreateTask;

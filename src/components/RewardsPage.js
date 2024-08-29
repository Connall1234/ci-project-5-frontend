import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "../styles/RewardsPage.module.css"; 

const RewardsPage = ({ match }) => {
  const { id } = match.params; // Extract the user ID from the URL parameters
  const [tasks, setTasks] = useState([]); // State to store tasks data
  const [error, setError] = useState(null); // State to store error messages
  const [highlightedReward, setHighlightedReward] = useState(null); // State to track which reward is highlighted (clicked)
  const [overdueCount, setOverdueCount] = useState(0); // State to store the number of overdue tasks
  const [loading, setLoading] = useState(true); // State to track loading status

  // Fetch tasks data from the API when the component mounts or the `id` changes
  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true); // Set loading to true when starting to fetch data
      try {
        // API call to fetch tasks for the current user
        const response = await axios.get(`https://project-5-backend-api-connall-3eb143768597.herokuapp.com/tasks/?owner=${id}`);
        setTasks(response.data.tasks || []); // Set tasks data in the state
        setOverdueCount(response.data.overdue_count); // Set the overdue task count
      } catch (error) {
        console.error('Error fetching tasks data', error); // Log errors if the API call fails
        setError('Failed to load tasks data.'); // Set an error message in the state
      } finally {
        setLoading(false); // Set loading to false after data is fetched or an error occurs
      }
    };

    if (id) {
      fetchTasks(); // Fetch tasks if the `id` is available
    }
  }, [id]); // The effect will re-run whenever `id` changes

  // Handle any errors that occurred during the data fetch
  if (error) {
    return <Alert variant="danger" className="mt-4">{error}</Alert>; // Display an error alert
  }

  // If loading, show the loading spinner
  if (loading) {
    return (
      <div className={styles.LoadingContainer}>
        <div className={styles.Spinner}></div>
        <p className={styles.LoadingText}>Loading...</p>
      </div>
    );
  }

  // Calculate the number of completed tasks
  const completedTasksCount = tasks.filter(task => task.completed).length;
  // Check if the user has no overdue tasks
  const hasNoOverdueTasks = overdueCount === 0; 

  // Define the rewards with their conditions and colors
  const rewards = [
    {
      title: 'Your First Task Complete',
      condition: completedTasksCount >= 1, // Unlock after completing 1 task
      color: 'green',
    },
    {
      title: 'Have 5 Tasks Complete',
      condition: completedTasksCount >= 5, // Unlock after completing 5 tasks
      color: 'blue',
    },
    {
      title: 'Have 10 Tasks Complete',
      condition: completedTasksCount >= 10, // Unlock after completing 10 tasks
      color: 'purple',
    },
    {
      title: 'Have No Overdue Tasks',
      condition: hasNoOverdueTasks, // Unlock if there are no overdue tasks
      color: 'orange',
    },
  ];

  // Handle clicking on a reward card
  const handleCardClick = (index, condition) => {
    if (condition) {
      // Highlight the clicked card if the reward condition is met (toggle highlight on and off)
      setHighlightedReward(index === highlightedReward ? null : index);
    }
  };

  return (
    <Container className={`mt-4 ${styles['rewards-page']}`}>
      <h1 className="text-center">Your Rewards</h1>
      <Row className="justify-content-center">
        {rewards.map((reward, index) => (
          <Col key={index} xs={12} md={6} lg={3} className="mb-4">
            {/* Card component to display each reward */}
            <Card
              className={`text-center ${styles['reward-card']} ${reward.condition ? styles.unlocked : styles.locked} ${highlightedReward === index ? styles.highlighted : ''}`}
              style={{ backgroundColor: reward.condition ? reward.color : 'grey' }} // Change background color based on reward condition
              onClick={() => handleCardClick(index, reward.condition)} // Handle click to highlight the card if unlocked
            >
              <Card.Body>
                {/* Display the reward title and lock icon if not unlocked */}
                <Card.Title className={reward.condition ? styles.unlocked : styles.locked}>
                  {reward.title} {!reward.condition && <i className="fas fa-lock"></i>}
                </Card.Title>
                {/* Display whether the reward is unlocked or locked */}
                {reward.condition ? (
                  <Card.Text>Unlocked</Card.Text>
                ) : (
                  <Card.Text>Locked</Card.Text>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default RewardsPage;

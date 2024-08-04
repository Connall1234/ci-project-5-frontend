import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/RewardsPage.module.css"; 

const RewardsPage = ({ match }) => {
  const { id } = match.params; 
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [highlightedReward, setHighlightedReward] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(`https://project-5-backend-api-connall-3eb143768597.herokuapp.com/tasks/?owner=${id}`);
        setTasks(response.data.tasks || []);
      } catch (error) {
        console.error('Error fetching tasks data', error);
        setError('Failed to load tasks data.');
      }
    };

    if (id) {
      fetchTasks();
    }
  }, [id]);

  if (error) {
    return <Alert variant="danger" className="mt-4">{error}</Alert>;
  }

  const completedTasksCount = tasks.filter(task => task.completed).length;
  const hasNoOverdueTasks = tasks.every(task => !task.overdue);

  const rewards = [
    {
      title: 'Your First Task Complete',
      condition: completedTasksCount >= 1,
      color: 'green',
    },
    {
      title: '5 Tasks Complete',
      condition: completedTasksCount >= 5,
      color: 'blue',
    },
    {
      title: '10 Tasks Complete',
      condition: completedTasksCount >= 10,
      color: 'purple',
    },
    {
      title: 'No Overdue Tasks',
      condition: hasNoOverdueTasks,
      color: 'orange',
    },
  ];

  const handleCardClick = (index, condition) => {
    if (condition) {
      setHighlightedReward(index === highlightedReward ? null : index);
    }
  };

  return (
    <Container className="mt-4 rewards-page">
      <h1 className="text-center">Your Rewards</h1>
      <Row className="justify-content-center">
        {rewards.map((reward, index) => (
          <Col key={index} xs={12} md={6} lg={3} className="mb-4">
            <Card
              className={`text-center reward-card ${reward.condition ? 'unlocked' : 'locked'} ${highlightedReward === index ? 'highlighted' : ''}`}
              style={{ backgroundColor: reward.condition ? reward.color : 'grey' }}
              onClick={() => handleCardClick(index, reward.condition)}
            >
              <Card.Body>
                <Card.Title className={reward.condition ? 'unlocked' : 'locked'}>
                  {reward.title} {!reward.condition && <i className="fas fa-lock"></i>}
                </Card.Title>
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

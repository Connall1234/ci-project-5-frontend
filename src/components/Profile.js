import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Alert, Button } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/ProfilePage.module.css"; // Adjust the path to your CSS file

const ProfilePage = (props) => {
  const { id } = props.match.params; // Extract userId from route parameters
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`https://project-5-backend-api-connall-3eb143768597.herokuapp.com/profiles/${id}`);
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile data', error);
        setError('Failed to load profile data.');
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id]);

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!profile) {
    return <p>Loading...</p>;
  }

  const { owner, completed_tasks_count, image, bio } = profile;

  return (
    <Container className="mt-4 profile-page">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="text-center">
            <Card.Img variant="top" src={image} className="profile-image" />
            <Card.Body>
              <Card.Title className="profile-name">{owner}</Card.Title>
              <Card.Text className="profile-bio">
                {bio}
              </Card.Text>
              <Card.Text className="profile-stats">
                Completed Tasks: {completed_tasks_count}
              </Card.Text>
              <Button variant="primary" href={`/profiles/${id}/edit`}>Edit Profile</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;

import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/ProfilePage.module.css"; 

const ProfilePage = (props) => {
  const { id } = props.match.params; 
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
    return <Alert variant="danger" className="mt-4">{error}</Alert>;
  }

  if (!profile) {
    return <p className="text-center mt-4">Loading...</p>;
  }

  const { owner, completed_tasks_count, image, bio, } = profile;

  return (
    <Container className="mt-4 profile-page">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="text-center">
            <Card.Img
              variant="top"
              src={image}
              className="profile-image"
              style={{ width: '200px', height: '200px', objectFit: 'cover', margin: '0 auto', borderRadius: '50%' }}
            />
            <Card.Body>
              <Card.Text className="welcome-message">
                Welcome back, {owner}!
              </Card.Text>
              <Card.Text className="profile-bio">
                {bio}
              </Card.Text>
              <Card.Text className="profile-stats">
                Completed Tasks: {completed_tasks_count}
              </Card.Text>
              <Button variant="primary" href={`/profiles/${id}/edit`} className="mr-2">Edit Profile</Button>
              <Link to={`/profiles/${id}/rewards`}>
                <Button variant="warning" style={{ color: 'white', backgroundColor: 'gold', borderColor: 'gold' }}>Your Rewards</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;

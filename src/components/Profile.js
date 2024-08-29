import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Alert, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../styles/ProfilePage.module.css"; 

const ProfilePage = (props) => {
  const { id } = props.match.params; // Extract the profile ID from the URL parameters
  const [profile, setProfile] = useState(null); // State to hold the profile data
  const [error, setError] = useState(null); // State to handle errors

  // Fetch profile data when the component mounts or the `id` changes
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // Make an API call to fetch the profile data based on the profile ID
        const response = await axios.get(`https://project-5-backend-api-connall-3eb143768597.herokuapp.com/profiles/${id}`);
        setProfile(response.data); // Set the profile data in the state
      } catch (error) {
        console.error('Error fetching profile data', error); // Log any errors that occur during the API call
        setError('Failed to load profile data.'); // Set the error state
      }
    };

    if (id) {
      fetchProfile(); // Fetch the profile if `id` is available
    }
  }, [id]); // The effect will run when the `id` changes

  // Handle any errors that occurred during the data fetch
  if (error) {
    return <Alert variant="danger" className="mt-4">{error}</Alert>; // Display an error alert
  }

  // Display a loading message if the profile data hasn't been loaded yet
  if (!profile) {
    return <p className="text-center mt-4">Loading...</p>; // Show a loading message while the data is being fetched
  }

  // Destructure the necessary properties from the profile object
  const { owner, completed_tasks_count, image, bio } = profile;

  return (
    <Container className="mt-4 profile-page">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="text-center">
            {/* Display the profile image with styling */}
            <Card.Img
              variant="top"
              src={image}
              className="profile-image"
              style={{ width: '200px', height: '200px', objectFit: 'cover', margin: '0 auto', borderRadius: '50%' }}
            />
            <Card.Body>
              {/* Welcome message with the owner's name */}
              <Card.Text className="welcome-message">
                Welcome back, {owner}!
              </Card.Text>
              {/* Display the user's bio */}
              <Card.Text className="profile-bio">
                {bio}
              </Card.Text>
              {/* Display the count of completed tasks */}
              <Card.Text className="profile-stats">
                Completed Tasks: {completed_tasks_count}
              </Card.Text>
              {/* Button to navigate to the Edit Profile page */}
              <Button variant="primary" href={`/profiles/${id}/edit`} className="mr-2">Edit Profile</Button>
              {/* Button to navigate to the user's Rewards page */}
              <Link to={`/profiles/${id}/rewards`}>
                <Button variant="warning" style={{ color: 'white', backgroundColor: 'gold', borderColor: 'gold' }}>Rewards</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;

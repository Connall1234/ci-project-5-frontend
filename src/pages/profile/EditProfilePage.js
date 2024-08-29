import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../styles/EditProfilePage.module.css";

const EditProfile = () => {
  const { id } = useParams(); // Extracts profile ID from URL parameters
  const history = useHistory(); // Used to navigate programmatically
  const [profile, setProfile] = useState({
    bio: '',
    image: null,
  }); // State to manage profile data
  const [error, setError] = useState(null); // State to manage error messages

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/profiles/${id}`);
        setProfile({
          bio: response.data.bio || '', // Set bio from response or default to empty string
          image: null, // Image is handled separately
        });
      } catch (error) {
        console.error('Error fetching profile data', error);
        setError('Failed to load profile data.'); // Set error message if fetching fails
      }
    };

    if (id) {
      fetchProfile(); // Fetch profile data when ID is available
    }
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setProfile((prevProfile) => ({
      ...prevProfile,
      image: file, // Update state with selected file
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('bio', profile.bio); // Append bio to FormData
    if (profile.image) {
      formData.append('image', profile.image); // Append image if available
    }

    try {
      await axios.put(`/profiles/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Specify the content type for file upload
        },
      });
      history.push(`/profiles/${id}`); // Navigate to the profile page upon success
    } catch (error) {
      console.error('Error updating profile', error);
      setError('Failed to update profile.'); // Set error message if update fails
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <h2>Edit Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>} {/* Display error if any */}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="bio">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="bio"
                value={profile.bio || ''} // Ensure value is never null
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group controlId="image">
              <Form.Label>Profile Image</Form.Label>
              <Form.File
                name="image"
                onChange={handleImageChange}
              />
            </Form.Group>
            <div className="d-flex justify-content-between">
              <Button type="submit" variant="primary" className="mr-2">Save Changes</Button>
              <Button variant="secondary" className="ml-2" onClick={() => history.push(`/profiles/${id}`)}>Cancel</Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default EditProfile;

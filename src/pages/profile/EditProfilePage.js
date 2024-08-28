import React, { useState, useEffect } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import "../../styles/EditProfilePage.module.css"

const EditProfile = () => {
  const { id } = useParams(); 
  const history = useHistory();
  const [profile, setProfile] = useState({
    bio: '',
    image: null,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/profiles/${id}`);
        setProfile({
          bio: response.data.bio || '',
          image: null, // Handle image separately
        });
      } catch (error) {
        console.error('Error fetching profile data', error);
        setError('Failed to load profile data.');
      }
    };

    if (id) {
      fetchProfile();
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
      image: file,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('bio', profile.bio);
    if (profile.image) { // Check if image is selected
      formData.append('image', profile.image);
    }

    try {
      await axios.put(`/profiles/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      history.push(`/profiles/${id}`);
    } catch (error) {
      console.error('Error updating profile', error);
      setError('Failed to update profile.');
    }
  };

  return (
    <Container>
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <h2>Edit Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
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

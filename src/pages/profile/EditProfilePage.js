import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from "../../styles/EditProfilePage.module.css"

const EditProfilePage = (props) => {
  const { id } = props.match.params; // get the users id 
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);
  const [image, setImage] = useState(null);
  const [bio, setBio] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`https://project-5-backend-api-connall-3eb143768597.herokuapp.com/profiles/${id}`);
        setProfile(response.data);
        setBio(response.data.bio || "");
      } catch (error) {
        console.error('Error fetching profile data', error);
        setError('Failed to load profile data.');
      }
    };

    if (id) {
      fetchProfile();
    }
  }, [id]);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      try {
        await axios.post(`https://project-5-backend-api-connall-3eb143768597.herokuapp.com/profiles/${id}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        // Refresh the profile 
        const response = await axios.get(`https://project-5-backend-api-connall-3eb143768597.herokuapp.com/profiles/${id}`);
        setProfile(response.data);
        setImage(response.data.image); // for images
      } catch (error) {
        console.error('Error uploading image', error);
        setError('Failed to upload image.');
      }
    }
  };

  const handleSave = async () => {
    try {
      await axios.put(`https://project-5-backend-api-connall-3eb143768597.herokuapp.com/profiles/${id}`, {
        bio,
      });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error('Error updating profile', error);
      setError('Failed to update profile.');
    }
  };

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!profile) {
    return <p>Loading...</p>;
  }

  return (
    <Container className={styles['profile-edit-container']}>
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Form>
            <Form.Group controlId="formBasicBio">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Profile Imagefff</Form.Label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="form-control-file"
              />
              {image && <img src={image} alt="Profile" className={styles['profile-image-preview']} />}
            </Form.Group>
            <Button variant="primary" className={styles['save-button']} onClick={handleSave}>Save Change??s</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default EditProfilePage;

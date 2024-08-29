import React from "react";
import { Container } from "react-bootstrap";
import styles from "../../styles/About.module.css"; // Import the CSS module

const About = () => {
  // This component represents the "About Us" page for the OnTrack app.
  // It provides a brief description of the app's features and goals.
  return (
    <Container className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>About Us</h1>
      </div>
      <p className={styles.description}>
        Welcome to OnTrack, your ultimate companion for staying organized and
        productive. Our app allows you to easily manage your tasks with features
        to edit, delete, and view your to-do list. Track your progress through
        your profile, where you can see how many tasks you've completed and
        monitor your achievements. As you work through your tasks, earn rewards
        to keep you motivated and on track. Whether you're managing personal
        goals or professional projects, OnTrack is designed to help you
        achieve more with less stress.
      </p>
    </Container>
  );
};

export default About;

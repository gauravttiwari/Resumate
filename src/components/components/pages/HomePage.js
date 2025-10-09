import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { FaFileAlt, FaDownload, FaChartBar, FaPalette, FaMagic, FaCloudUploadAlt, FaMobileAlt, FaLock } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css';

const HomePage = () => {
  const features = [
    {
      icon: <FaFileAlt size={50} />,
      title: "Resume Builder",
      description: "Create professional resumes with our easy-to-use builder that guides you through each section."
    },
    {
      icon: <FaPalette size={50} />,
      title: "Multiple Templates",
      description: "Choose from a variety of professionally designed templates to match your personal style."
    },
    {
      icon: <FaDownload size={50} />,
      title: "Export Options",
      description: "Download your resume as PDF, DOCX, or share it online with a custom link."
    },
    {
      icon: <FaChartBar size={50} />,
      title: "ATS Optimization",
      description: "Get insights on how well your resume will perform with Applicant Tracking Systems."
    },
    {
      icon: <FaMagic size={50} />,
      title: "AI Content Suggestions",
      description: "Receive AI-powered suggestions to improve your resume content and wording."
    },
    {
      icon: <FaCloudUploadAlt size={50} />,
      title: "Cloud Storage",
      description: "Save and access your resumes from anywhere with secure cloud storage."
    },
    {
      icon: <FaMobileAlt size={50} />,
      title: "Fully Responsive",
      description: "Create and edit your resume on any device - mobile, tablet, or desktop."
    },
    {
      icon: <FaLock size={50} />,
      title: "Privacy Protection",
      description: "Your data is secure and private with our advanced security measures."
    }
  ];

  return (
    <div className="home-page">
      <div className="hero-section">
        <Container>
          <Row>
            <Col md={6}>
              <h1>Create Professional Resumes in Minutes</h1>
              <p className="lead">
                Resumate helps you build ATS-friendly resumes that stand out and get you hired.
              </p>
              <div className="hero-buttons">
                <Link to="/create">
                  <Button variant="primary" size="lg">Create Resume</Button>
                </Link>
                <Link to="/templates">
                  <Button variant="outline-primary" size="lg">View Templates</Button>
                </Link>
              </div>
            </Col>
            <Col md={6}>
              <img src="/images/resume-preview.png" alt="Resume Preview" className="hero-image" />
            </Col>
          </Row>
        </Container>
      </div>

      <div className="features-section">
        <Container>
          <h2 className="text-center mb-5">Features that Make Resume Building Easy</h2>
          <Row>
            {features.map((feature, index) => (
              <Col lg={3} md={4} sm={6} key={index}>
                <Card className="feature-card">
                  <Card.Body>
                    <div className="feature-icon">{feature.icon}</div>
                    <Card.Title>{feature.title}</Card.Title>
                    <Card.Text>{feature.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div>

      <div className="cta-section">
        <Container className="text-center">
          <h2>Ready to Create Your Professional Resume?</h2>
          <p>Join thousands of job seekers who found their dream job with Resumate</p>
          <Link to="/signup">
            <Button variant="success" size="lg">Get Started for Free</Button>
          </Link>
        </Container>
      </div>
    </div>
  );
};

export default HomePage;
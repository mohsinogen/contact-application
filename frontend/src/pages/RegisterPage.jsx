import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { useAuth } from "../context/AuthContext";
import { baseURL } from "../utils/env";
import axios from "axios";

const LoginPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { user, setUser } = useAuth();

  useEffect(() => {}, []);

  const registerHandler = async (e) => {
    setError('')
    e.preventDefault();
    if (name && email && password) {
      setLoading(true);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };

        const response = await axios.post(
          baseURL + "/api/users",
          { name, email, password },
          config
        );
        setLoading(false);

        console.log("res", response);

        /* if (response.data) {
                  const userData = await response.json();
                  setUser(userData);
                  localStorage.setItem('user', JSON.stringify(userData));
                } else {
                  console.error('Authentication failed');
                } */
      } catch (error) {
        setLoading(false);
        if(error.response && error.response.data.remark){
            setError(error.response.data.remark)
        } else{
            setError(error.message)
        }
      }
    } else {
        setError("Fields can't be empty")
    }
  };

  return (
    <Container className="mt-5">
      <FormContainer>
        <h1>Register</h1>
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}
        <Form className="mt-5" onSubmit={registerHandler}>
          <Form.Group className="mt-3" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              required
              type="text"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group className="mt-3" controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              required
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group className="mt-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              required
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button className="mt-5" type="submit" variant="primary">
            Register
          </Button>
        </Form>

        <Row className="py-3">
          <Col>
            Already a User? <Link to={`/login`}>Login</Link>
          </Col>
        </Row>
      </FormContainer>
    </Container>
  );
};

export default LoginPage;

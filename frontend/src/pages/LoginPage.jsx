import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col, Container } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { useAuth } from "../context/AuthContext";
import { baseURL } from "../utils/env";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { user, setUserData } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {}, []);

  const loginHandler = async (e) => {
    setError("");
    e.preventDefault();
    if (email && password) {
      setLoading(true);
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };

        const response = await axios.post(
          baseURL + "/api/users/login",
          { email, password },
          config
        );
        setLoading(false);

        console.log("res", response.data);

        if (response.data.remark == "success") {
          const userData = response.data.data;
          setUserData(userData);
          localStorage.setItem("userData", JSON.stringify(userData));
          navigate("/home",{replace:true})
        } else {
          setError("Something went wrong!");
        }
      } catch (error) {
        setLoading(false);
        if (error.response && error.response.data.remark) {
          setError(error.response.data.remark);
        } else {
          setError(error.message);
        }
      }
    } else {
      setError("Fields can't be empty");
    }
  };

  return (
    <Container className="mt-5">
      <FormContainer>
        <h1>Sign In</h1>
        {error && <Message variant="danger">{error}</Message>}
        {loading && <Loader />}
        <Form className="mt-5" onSubmit={loginHandler}>
          <Form.Group className="mt-3" controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group className="mt-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button className="mt-5" type="submit" variant="primary">
            Sign In
          </Button>
        </Form>

        <Row className="py-3">
          <Col>
            New User? <Link to={`/register`}>Register</Link>
          </Col>
        </Row>
      </FormContainer>
    </Container>
  );
};

export default LoginPage;

import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { baseURL } from "../utils/env";

function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { user, setUserData } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
  }, [user]);

  const profileUpdateHandler = async (e) => {
    setError('')
    e.preventDefault();

    if(!name && !email){
      setError("Fields can't be blank");
      return;
    }

    if(password != "" && (!confirmPassword || password !== confirmPassword)){
      setError("Password and confirm password does not match")
      return;
    }

        setLoading(true);
        try {
          const config = {
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${user.token}`,

            },
          };
  
          const response = await axios.put(
            baseURL + "/api/users",
            { name, email, password },
            config
          );
          setLoading(false);
  
          console.log("res", response.data);
  
          if (response.data.remark == "success") {
            const userData = response.data.data;
            setUserData(userData);
            localStorage.setItem("userData", JSON.stringify(userData));

            setSuccess("Profile updated successfully");
            setTimeout(()=>{
              setSuccess("")
            },3000)
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
    
  };

  return (
    <Container className="pt-3">
      <Row className="justify-content-center">
        <Col md={"5"}>
          {error &&
            <Message variant="danger">{error}</Message>
          }
          {success &&
            <Message variant="success">{success}</Message>
          }
          {loading ? (
            <Loader />
          )  : (
            <Form onSubmit={profileUpdateHandler}>
              <Form.Group className="my-2" controlId="name">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  required
                  type="name"
                  placeholder="Enter name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group className="my-2" controlId="email">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  required
                  readOnly
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group className="my-2" controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Form.Group className="my-2" controlId="confirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                ></Form.Control>
              </Form.Group>

              <Button type="submit" variant="primary">
                Update
              </Button>
            </Form>
          )}
        </Col>
      </Row>
    </Container>
  );
}

export default ProfilePage;

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { baseURL } from "../utils/env";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  Button,
  ButtonGroup,
  Card,
  Col,
  Container,
  Image,
  ListGroup,
  Row,
} from "react-bootstrap";

function ContactPage() {
  const params = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [contact, setContact] = useState({});

  const getContactDetails = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const res = await axios.get(
        baseURL + `/api/contacts/${params.contactId}`
      );
      setContact(res.data.data);
      console.log(res.data);
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.data.remark) {
        setError(error.response.data.remark);
      } else {
        setError(error.message);
      }
      console.log("error", error);
      setLoading(false);
    }
  };

  const deleteContactHandler = async () => {
    setLoading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.token}`
        },
      };

      const res = await axios.delete(
        baseURL + `/api/contacts/${params.contactId}`, config
      );
      alert('Contact deleted')
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.data.remark) {
        setError(error.response.data.remark);
      } else {
        setError(error.message);
      }
      console.log("error", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getContactDetails();
  }, []);

  return (
    <Container>
      <Row className="d-flex justify-content-between">
        <Col md={3}>
          <Button
            className="my-3"
            variant="light"
            onClick={() => {
              navigate(-1);
            }}
          >
            <i className="fas fa-chevron-left" /> Go Back
          </Button>
        </Col>

        {user && (
          <Col md={3}>
            <Button
              className="my-3"
              variant="primary"
              onClick={() => {
                navigate(`/editcontact/${contact._id}`);
              }}
            >
              <i className="fa-solid fa-pen me-2" /> Edit Contact
            </Button>
          </Col>
        )}
        {user &&
          contact.createdBy ==
            user?._id && (
              <Col md={1}>
                <Button
                  className="my-3"
                  variant="danger"
                  onClick={deleteContactHandler}
                >
                  <i class="fa-solid fa-trash" />
                </Button>
              </Col>
            )}
      </Row>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            <Col style={{ textAlign: "center" }} md={3}>
              <Image
                src={
                  contact.profile
                    ? contact.profile
                    : require("../assets/user.png")
                }
                alt={contact.firstname}
                fluid
              />
            </Col>
            <Col md={6}>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>Name : {contact.firstname + contact.lastname} </h3>
                </ListGroup.Item>

                <ListGroup.Item>Number: {contact.number}</ListGroup.Item>
                <ListGroup.Item>Gender: {contact.gender}</ListGroup.Item>
                <ListGroup.Item>Address: {contact.address}</ListGroup.Item>
              </ListGroup>
            </Col>
            {contact.qrcode && (
              <Col md={3}>
                <Card>
                  <Image src={contact.qrcode} alt={contact.firstname} fluid />
                </Card>
              </Col>
            )}
          </Row>
        </>
      )}
    </Container>
  );
}

export default ContactPage;

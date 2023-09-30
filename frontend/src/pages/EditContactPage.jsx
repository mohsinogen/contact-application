import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import { Form, Button, Container, Image, Col, Row } from "react-bootstrap";
import Message from "../components/Message";
import axios from "axios";
import { baseURL } from "../utils/env";
import { useAuth } from "../context/AuthContext";

function EditContactPage() {
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [img, setImg] = useState();

  const { user } = useAuth();

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

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("")
    try {
      const formValues = {
        firstname: e.target.firstname.value,
        lastname: e.target.lastname.value,
        number: e.target.number.value,
        gender: e.target.gender.value,
        address: e.target.address.value,
        profile: e.target.profile.files[0],
      };

      if (formValues.profile) {
        const formData = new FormData();
        formData.append("image", formValues.profile);

        const fileRes = await axios.post(baseURL + "/file", formData);

        formValues.profile = fileRes.data.path;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const contactRes = await axios.put(
        baseURL + `/api/contacts/${contact._id}`,
        formValues,
        config
      );

      console.log(contactRes);
    } catch (error) {
      setError("Something went wrong");
      console.log(error);
    }
  };

  const navigate = useNavigate();

  const onImageChange = (e) => {
    const [file] = e.target.files;
    setImg(URL.createObjectURL(file));
  };

  useEffect(()=>{
    getContactDetails();
  },[])

  return (
    <Container>
      <Button className="my-3" variant="light" onClick={() => navigate(-1)}>
        <i className="fas fa-chevron-left" /> Go Back
      </Button>
      <FormContainer>
        <h1>Edit Contact</h1>
        {error && <Message variant="danger">{error}</Message>}
        {loading ? (
          <Loader />
        ) : (
          <Form onSubmit={submitHandler} className="my-5">
            <Form.Group className="mb-3">
              <Row className="justify-content-center">
                <Col className="text-center" xs={4} md={4}>
                  <Image
                    style={{
                      width: "8rem",
                      height: "8rem",
                      objectFit: "cover",
                    }}
                    src={img ? img : contact?.profile ? `${baseURL+'/images/'+contact.profile}`: require("../assets/user.png")}
                    roundedCircle
                  />
                  <Form.Label for="profile" className="btn btn-primary">
                    <i className="fas fa-pen" />
                  </Form.Label>
                </Col>
              </Row>

              <Form.Control
                onChange={onImageChange}
                id="profile"
                className="d-none"
                type="file"
              />
            </Form.Group>

            <Form.Group className="my-3" controlId="firstname">
              <Form.Label>Firstname</Form.Label>
              <Form.Control
                required
                type="text"
                name="firstname"
                placeholder="Enter Firstname"
                defaultValue={contact.firstname}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="my-3" controlId="lastname">
              <Form.Label>Lastname</Form.Label>
              <Form.Control
                type="text"
                name="lastname"
                placeholder="Enter Lastname"
                defaultValue={contact.lastname}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="my-3" controlId="number">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                required
                name="number"
                type="number"
                placeholder="Enter Phone Number"
                defaultValue={contact.number}
              ></Form.Control>
            </Form.Group>

            <Form.Group className="my-3" controlId="gender">
              <Form.Label>Gender</Form.Label>
              <Form.Select name="gender" defaultValue={contact.gender}>
                <option value={""}>Select Gender</option>
                <option value={"male"}>Male</option>
                <option value={"female"}>Female</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="my-3" controlId="address">
              <Form.Label>Address</Form.Label>
              <Form.Control
                name="address"
                as="textarea"
                rows={3}
                type="text"
                placeholder="Enter Address"
                defaultValue={contact.address}
              ></Form.Control>
            </Form.Group>

            <Button
              style={{ width: "100%" }}
              size="lg"
              className="my-3"
              variant="primary"
              type="submit"
            >
              Submit
            </Button>
          </Form>
        )}
      </FormContainer>
      
    </Container>
  );
}

export default EditContactPage;

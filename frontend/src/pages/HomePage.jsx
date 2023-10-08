import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Image,
  Pagination,
  Row,
  Table,
} from "react-bootstrap";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { baseURL } from "../utils/env";
import axios from "axios";

function HomePage() {
  const location = useLocation();
  const navigate = useNavigate();

  const { user } = useAuth();

  const [searchParams, setSearchParams] = useSearchParams();

  const pageSize = Number(searchParams.get("pageSize")) || 5;
  const pageNumber = Number(searchParams.get("pageNumber")) || 1;
  const searchUsing = searchParams.get("searchUsing") || "";
  const gender = searchParams.get("gender") || "";
  const query = searchParams.get("query") || "";

  const [newPageSize, setNewPageSize] = useState(pageSize);
  const [newPageNumber, setNewPageNumber] = useState(pageNumber);
  const [newSearchUsing, setNewSearchUsing] = useState(searchUsing);
  const [newGender, setNewGender] = useState(gender);
  const [newQuery, setNewQuery] = useState(query);

  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [contactList, setContactList] = useState([]);

  const getContacts = async () => {
    setLoading(true);
    setError("");
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const res = await axios.get(
        baseURL +
          `/api/contacts?pageSize=${newPageSize}&pageNumber=${newPageNumber}&searchUsing=${newSearchUsing}&query=${newQuery}&gender=${newGender}`
      );
      setContactList(res.data.data.contactList);
      setTotalPages(res.data.data.totalPages);
      setTotalRecords(res.data.data.totalRecords);

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
    getContacts();
  }, [searchParams]);

  return (
    <Container>
      <Row className="mt-1 align-items-center justify-content-between">
        <Col className="py-3" xs={"12"} md={"3"}>
          <div className="d-flex align-items-center justify-content-start rounded px-3 border-radius-3 border border-secondary">
            <i className="me-3 fas fa-search" />
            <Form.Group style={{ flex: 1 }} controlId="search">
              <Form.Control
                value={newQuery}
                type="text"
                placeholder="Search contact"
                onChange={(e) => {
                  setNewPageNumber("1");
                  setNewQuery(e.target.value);
                  /* setSearchParams({
                    pageSize: newPageSize.toString(),
                    pageNumber: "1",
                    searchUsing: newSearchUsing,
                    gender: newGender,
                    query: e.target.value,
                  }); */
                }}
              ></Form.Control>
            </Form.Group>
          </div>
        </Col>
        <Col xs={"12"} md={"3"}>
          <Form.Select
            value={newSearchUsing}
            onChange={(e) => {
              setNewPageNumber("1");
              setNewSearchUsing(e.target.value);
              /* setSearchParams({
                pageSize: newPageSize.toString(),
                pageNumber: "1",
                searchUsing: e.target.value,
                gender: newGender,
                query: newQuery,
              }); */
            }}
            placeholder="Search using"
            defaultValue={""}
          >
            <option value={""}>Search Using</option>
            <option value={"Firstname"}>Firstname</option>
            <option value={"lastname"}>Lastname</option>
            <option value={"number"}>Number</option>
          </Form.Select>
        </Col>
        <Col xs={"12"} md={"2"}>
          <Form.Select
            value={newGender}
            onChange={(e) => {
              setNewGender(e.target.value);
              setNewPageNumber("1");
              /* setSearchParams({
                pageSize: newPageSize.toString(),
                pageNumber: "1",
                searchUsing: newSearchUsing,
                gender: e.target.value,
                query: newQuery,
              }); */
            }}
            placeholder="Select gender"
            defaultValue={""}
          >
            <option value={""}>Select Gender</option>
            <option value={"male"}>Male</option>
            <option value={"female"}>Female</option>
          </Form.Select>
        </Col>
        <Col className="d-grid gap-2 py-3" xs={"12"} md={"1"}>
          <Button
            onClick={() => {
              setSearchParams({
                pageSize: "5",
                pageNumber: "1",
                searchUsing: newSearchUsing,
                gender: newGender,
                query: newQuery,
              });
            }}
          >
            Search
          </Button>
        </Col>
        <Col className="d-grid gap-2 py-3" xs={"12"} md={"3"}>
          {user && (
            <Button
              onClick={() => {
                navigate("/newcontact");
              }}
            >
              <i className="fas fa-plus"></i> Create
            </Button>
          )}
        </Col>
      </Row>

      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}

      {contactList.length >= 1 && (
        <>
          <Row>
            <Col md={4}>
              <Form.Label>Records to show</Form.Label>
              <Form.Select
                value={pageSize}
                onChange={(e) => {
                  setNewPageSize(e.target.value);
                  setSearchParams({
                    pageSize: e.target.value.toString(),
                    pageNumber: newPageNumber.toString(),
                  });
                }}
                placeholder="Rows to show"
              >
                <option value={3}>3 Records</option>
                <option value={5}>5 Records</option>
                <option value={10}>10 Records</option>
                <option value={15}>15 Records</option>
              </Form.Select>
            </Col>
          </Row>

          <h5 className="mt-3">Showing {totalRecords} records</h5>

          <Table hover striped responsive>
            <thead>
              <tr>
                <th></th>

                <th>Firstname</th>
                <th>Lastname</th>
                <th>Number</th>
                <th>Gender</th>
              </tr>
            </thead>
            <tbody>
              {contactList.map((item, index) => (
                <tr
                  style={{ cursor: "pointer" }}
                  key={index}
                  onClick={() => {
                    navigate(`/contacts/${item._id}`);
                  }}
                >
                  <td>
                    <Image
                      style={{
                        height: "60px",
                        width: "60px",
                        objectFit: "cover",
                      }}
                      src={
                        item.profile
                          ? item.profile
                          : require("../assets/user.png")
                      }
                      roundedCircle
                    />
                  </td>
                  <td key={index}>{item?.firstname}</td>
                  <td key={index}>{item?.lastname}</td>
                  <td key={index}>{item?.number}</td>
                  <td key={index}>{item?.gender}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          {totalPages > 1 && (
            <Pagination>
              {[...Array(totalPages)].map((item, index) => (
                <Pagination.Item
                  active={newPageNumber === index + 1 ? true : false}
                  key={item}
                  onClick={() => {
                    setNewPageNumber(index + 1);
                    setSearchParams({
                      pageSize: newPageSize.toString(),
                      pageNumber: `${index + 1}`,
                      searchUsing: newSearchUsing,
                      gender: newGender,
                      query: newQuery,
                    });
                  }}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          )}
        </>
      )}
    </Container>
  );
}

export default HomePage;

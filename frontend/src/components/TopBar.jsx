import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function TopBar() {
  const location = useLocation();

  const { user, setUserData } = useAuth();

  const navigate = useNavigate();

  const logoutHandler = () => {
    setUserData(null);
    localStorage.removeItem("userData");
    //navigate("/login", { replace: true })
  };

  const profileClickHandler = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate("/profile");
    }
  };

  if (["/login", "/register"].includes(location.pathname)) {
    return null;
  }
  return (
    <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
      <Container>
        <Link className="mx-3" style={{ textDecoration: "none" }} to="/home">
          <Navbar.Brand><img
              alt=""
              src={require('../assets/contactAppLogo.png')}
              width="40"
              height="40"
              className="d-inline-block align-top"
            />{' '}Contact Book</Navbar.Brand>
        </Link>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          {user && <Nav.Link onClick={()=> navigate("/favourites")}>
            <i className="fa-solid fa-heart me-2" />
            Favourites
          </Nav.Link>}
          <Nav className="ms-auto">
            <Nav.Link onClick={profileClickHandler}>
              <i className="fa-solid fa-user me-2" />
              {user ? user?.name : "Login"}
            </Nav.Link>

            {user && (
              <Nav.Link onClick={logoutHandler}>
                <i className="fa-solid fa-right-from-bracket me-2" />
                Logout
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TopBar;

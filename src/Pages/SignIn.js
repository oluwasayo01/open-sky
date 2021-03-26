import React, {useState } from "react";
import { Container, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import "bootstrap/dist/css/bootstrap.min.css";





const SignIn = ({history}) => {
  const [data, setData] = useState({username: "", password: ""})

  function handleSubmit(event) {
    event.preventDefault();
    history.push({
        pathname: '/dashboard',
        state: data
    })
    console.log(data)
  }

  function handleChange(event){
    event.preventDefault();
    setData({...data, [event.target.name]: event.target.value})
  }
  
  return (
    <Container>
      <Row className="justify-content-center">
        <Col lg={5}>
          <h1 className="text-center">Sign in</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email Address</Form.Label>
              <Form.Control type="text" placeholder="username" name="username" onChange={handleChange}/>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Row>
                <Col>
                  <Form.Label>Password</Form.Label>
                </Col>

                <Col lg="auto">
                  <Form.Label>Forgot Password?</Form.Label>
                </Col>
              </Row>
              <InputGroup>
            
                <Form.Control
                  type="password"
                  placeholder="Enter your password"
                  name="password"
                  onChange={handleChange}
                />
                <InputGroup.Append>
                  <InputGroup.Text>
                    <FontAwesomeIcon icon={faEye} />
                  </InputGroup.Text>
                </InputGroup.Append>
              </InputGroup>
            </Form.Group>

            <Button variant="primary" type="submit" block>
              Sign In
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SignIn;

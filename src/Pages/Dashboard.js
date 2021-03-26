import React, { useState, useEffect } from "react";
import { Form, Container, Button, Row, Col, Spinner } from "react-bootstrap";
import client from "../Client";
import DatePicker from "react-datepicker";
import { toast, ToastContainer } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";

const dayjs = require("dayjs");

const Dashboard = ({ location }) => {
  const [arrivalsNumber, setArrivalsNumber] = useState(0);
  const [departuresNumber, setDeparturesNumber] = useState(0);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [cred, setCred] = useState(location.state);
  const [airport, setAirport] = useState();
  const [arrivalLoading, setArrivalLoading] = useState(false);
  const [departureLoading, setDepartureLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const days = new Date(endDate - startDate).getDate();
    if (days > 7) {
      toast.error("Supply date within a range of 7 days");
      return;
    }

    if (days < 0) {
      toast.error("end date must be after start date");
      return;
    }

    if (startDate && endDate && airport) {
      setArrivalLoading(true);
      setDepartureLoading(true);
      client
        .getArrivals(cred.username, cred.password, airport, startDate, endDate)
        .then((response) => {
          return response.json();
        })
        .then((resp) => {
          setArrivalsNumber(resp.length);
          setArrivalLoading(false);
        })
        .catch((err) => {
          toast.error("An error occured. Try again");
        });
      client
        .getDepartures(
          cred.username,
          cred.password,
          airport,
          startDate,
          endDate
        )
        .then((response) => response.json())
        .then((resp) => {
          setDeparturesNumber(resp.length);
          setDepartureLoading(false);
        })
        .catch((err) => {});
    } else {
      toast.error("Supply all values");
      return;
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    setAirport(e.target.value);
  };

  useEffect(() => {
    toast.success("Your login details will be used for OpenSky Authentication");
  }, []);

  return (
    <>
      <Container>
        <Form onSubmit={handleSubmit}>
          <Row className="justify-content-center">
            <Col lg={5} md={4}>
              <Form.Group controlId="formBasicText">
                <Form.Label>Airport Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Airport code"
                  name="airport"
                  onChange={handleChange}
                />
              </Form.Group>
              <div className="d-flex justify-content-around">
                <Form.Label>From</Form.Label>
                <Form.Label>To</Form.Label>
              </div>
              <div className="d-flex justify-content-between">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => {
                    setStartDate(date);
                  }}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={5}
                  timeCaption="Time"
                  dateFormat="MMM dd, yyyy hh:mm aa"
                />
                <DatePicker
                  selected={endDate}
                  onChange={(date) => {
                    setEndDate(date);
                  }}
                  showTimeSelect
                  timeFormat="HH:mm"
                  timeIntervals={5}
                  timeCaption="Time"
                  dateFormat="MMM dd, yyyy hh:mm aa"
                />
              </div>
              <Button className="mt-5 mr-5" type="submit">
                Get Info
              </Button>
            </Col>
          </Row>
        </Form>
        <div className="d-flex justify-content-around mt-5 pr-5">
          <h1 className="border-right border-primary text-align-center">
            {airport}
          </h1>
          <h1 className="border-right border-primary pr-5">
            {startDate && dayjs(startDate).format("DD-MMM-YYYY hh:mm A")}-{" "}
            {endDate && dayjs(endDate).format("DD-MMM-YYYY hh:mm A")}
          </h1>
          <h2 className="border-right border-primary pr-5">
            {arrivalLoading ? (
              <Spinner animation="border" variant="primary" />
            ) : (
              arrivalsNumber
            )}
          </h2>
          <h2 className="border-right border-primary pr-5">
            {departureLoading ? (
              <Spinner animation="border" variant="primary" />
            ) : (
              departuresNumber
            )}
          </h2>
        </div>
      </Container>
      <ToastContainer />
    </>
  );
};

export default Dashboard;

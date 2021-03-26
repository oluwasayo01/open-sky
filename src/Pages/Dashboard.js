import React, { useState, useEffect } from "react";
import {
  Form,
  Container,
  Button,
  Row,
  Col,
  Spinner,
  Table,
} from "react-bootstrap";
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
      setCred(cred);
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
          setArrivalLoading(false);
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
        .catch((err) => {
          setDepartureLoading(false);
        });
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
            <Col lg={5} md={5} xl={4} my={5}>
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
              <Button className="mt-5 mr-5" type="submit" block>
                Get Info
              </Button>
            </Col>
          </Row>
        </Form>

        <Table striped bordered hover className="mt-5">
          <thead>
            <tr>
              <th>Airport</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Arrivals</th>
              <th>Departures</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{airport}</td>
              <td>
                <p>
                  {startDate && dayjs(startDate).format("DD-MMM-YYYY hh:mm A")}
                </p>
              </td>
              <td>
                <p>{endDate && dayjs(endDate).format("DD-MMM-YYYY hh:mm A")}</p>
              </td>
              <td>
                <p>
                  {arrivalLoading ? (
                    <Spinner animation="border" variant="primary" />
                  ) : (
                    arrivalsNumber
                  )}
                </p>
              </td>
              <td>
                <p>
                  {departureLoading ? (
                    <Spinner animation="border" variant="primary" />
                  ) : (
                    departuresNumber
                  )}
                </p>
              </td>
            </tr>
          </tbody>
        </Table>
      </Container>
      <ToastContainer />
    </>
  );
};

export default Dashboard;

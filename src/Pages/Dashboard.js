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
import { PieChart, Pie, Tooltip } from "recharts";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";

const dayjs = require("dayjs");

const Dashboard = ({ location }) => {
  const [arrivalsNumber, setArrivalsNumber] = useState();
  const [departuresNumber, setDeparturesNumber] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [cred, setCred] = useState(location.state);
  const [airport, setAirport] = useState();
  const [arrivalLoading, setArrivalLoading] = useState(false);
  const [departureLoading, setDepartureLoading] = useState(false);
  const [arrivalReady, setArrivalReady] = useState(false);
  const [departureReady, setDepartureReady] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const difference = endDate - startDate;
    const days = new Date(endDate - startDate).getDate();
    if (difference < 0) {
      toast.error("end date must be after start date");
      return;
    }

    if (days > 7) {
      toast.error("Supply date within a range of 7 days");
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
          setArrivalReady(true);
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
          setDepartureReady(true);
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

  const data = [
    {
      name: "Arrivals",
      value: arrivalsNumber,
    },
    {
      name: "Departures",
      value: departuresNumber,
    },
  ];

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
                  minDate={new Date("1970-01-01")}
                  maxDate={new Date()}
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
                  minDate={new Date("1970-01-01")}
                  maxDate={new Date()}
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
              <th>Start Time</th>
              <th>End Date</th>
              <th>End Time</th>
              <th>Arrivals</th>
              <th>Departures</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{airport}</td>
              <td>
                <p>{startDate && dayjs(startDate).format("DD-MMM-YYYY")}</p>
              </td>
              <td>
                <p>{startDate && dayjs(startDate).format("hh:mm A")}</p>
              </td>
              <td>
                <p>{endDate && dayjs(endDate).format("DD-MMM-YYYY")}</p>
              </td>
              <td>
                <p>{endDate && dayjs(endDate).format("hh:mm A")}</p>
              </td>
              <td>
                {arrivalLoading ? (
                  <Spinner animation="border" variant="primary" />
                ) : (
                  <p>{arrivalsNumber}</p>
                )}
              </td>
              <td>
                {departureLoading ? (
                  <Spinner animation="border" variant="primary" />
                ) : (
                  <p>{departuresNumber}</p>
                )}
              </td>
            </tr>
          </tbody>
        </Table>
      </Container>
      <Container className="d-flex justify-content-center">
        {arrivalReady && departureReady && (
          <PieChart width={750} height={300}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={80}
              fill="blue"
              label
            />
            <Tooltip />
          </PieChart>
        )}
      </Container>

      <ToastContainer />
    </>
  );
};

export default Dashboard;

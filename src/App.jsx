import { useState, useCallback } from "react";
import {
  Button,
  Form,
  Col,
  Row,
  Container,
  Spinner,
  Alert,
  Modal,
} from "react-bootstrap";
import "./App.css";
import axios from "axios";

function App() {
  const BASE = "https://openexchangerates.org/api/latest.json?app_id=";

  const [value, setValue] = useState(1);
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("UGX");
  const [showSpinner, setShowSpinner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [formValidity, setFormValidity] = useState(false);
  const [result, setResult] = useState("");
  const [errors, setErrors] = useState("");

  function handleValue(e) {
    setValue(e.target.value.replace(/\D/g, ""));
  }

  function handleSetFrom(e) {
    setFrom(e.target.value);
  }

  function handleSetTo(e) {
    setTo(e.target.value);
  }

  const carryOutConversion = useCallback(
    (res) => {
      if (res.status !== 200) {
        return false;
      }
      const convertFrom = res.data.rates[from];
      const convertTo = res.data.rates[to];
      const conversionResult = (1 / convertFrom) * convertTo * value;
      return conversionResult.toFixed(2);
    },
    [value, to, from]
  );

  const handleConversion = useCallback(
    (e) => {
      e.preventDefault();
      setFormValidity(true);
      if (e.currentTarget.checkValidity() === true) {
        setShowSpinner(true);
        axios
          .get(BASE)
          .then((response) => {
            console.log(response);
            let conversion = carryOutConversion(response);
            console.log(conversion);
            if (conversion) {
              setResult(conversion);
              setShowModal(true);
              setShowSpinner(false);
              setShowAlert(false);
            } else {
              defineAlert();
            }
          })
          .catch((error) => {
            console.log(error);
            setErrors(error);
            defineAlert();
          });
      }
    },
    [value, from, to, carryOutConversion]
  );

  function handleCloseModal() {
    setValue(1);
    setFrom("UGX");
    setTo("USD");
    setFormValidity(false);
    setShowModal(false);
  }

  function defineAlert() {
    setShowAlert(true);
    setShowSpinner(false);
  }

  return (
    <Container className="mt-5">
      <span>
        <img
          src="https://raw.githubusercontent.com/crane-cloud/frontend/develop/public/favicon.png"
          width="50"
          alt=""
        />
      </span>
      <h1 className="mt-4 mb-4">
        Crane Cloud Currency Converter Investigation
      </h1>
      <Alert variant="danger" show={showAlert}>
        Error! {errors}
      </Alert>

      <Form onSubmit={handleConversion} noValidate validated={formValidity}>
        <Row>
          <Col sm="3">
            <Form.Control
              placeholder="0"
              value={value}
              onChange={handleValue}
              required
            />
          </Col>
          <Col sm="3">
            <Form.Control value="USD" onChange={handleSetFrom} />
          </Col>
          <Col sm="3">
            <Form.Control value="UGX" onChange={handleSetTo} />
          </Col>
          <Col sm="2">
            <Button variant="success" type="submit" data-testid="btn-converter">
              <span className={showSpinner ? "" : "hidden"}>
                <Spinner animation="border" size="sm" />
              </span>
              <span className={showSpinner ? "hidden" : ""}>Convert</span>
            </Button>
          </Col>
        </Row>
        <Row>
          <small className="mt-4">Made with love by Rhodin</small>
        </Row>
      </Form>

      <Modal
        data-testid="modal"
        show={showModal}
        centered
        style={{ color: "#222" }}
        onHide={handleCloseModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Result</Modal.Title>
        </Modal.Header>
        <Modal.Body>{result}</Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCloseModal} variant="success">
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default App;

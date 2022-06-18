import { useState, useCallback } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
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
  const BASE =
    "http://data.fixer.io/api/latest?access_key=IRlAAk1uhEnPWV4f4cWlfccDJdHd3afC";

  const [value, setValue] = useState(1);
  const [from, setFrom] = useState("UGX");
  const [to, setTo] = useState("USD");
  const [showSpinner, , setShowSpinner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [formValidity, setFormValidity] = useState(false);
  const [result, setResult] = useState("");

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
      if (!res || res.success !== true) {
        return false;
      }

      const convertFrom = res.rates[from];
      const convertTo = res.rates[to];
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
            let conversion = carryOutConversion(response.data);
            if (conversion) {
              setResult(`${value} ${from} = ${conversion} ${to}`);
              setShowModal(true);
              setShowSpinner(false);
              setShowAlert(false);
            } else {
              defineAlert();
            }
          })
          .catch((error) => {
            console.log(error);
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
    <Container>
      <h1 className="mt-4 mb-4">Currency Converter Investigation</h1>
      <Alert variant="danger" show={showAlert}>
        Error!
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
            <Form.Control as="select" value="UGX" onChange={handleSetFrom} />
          </Col>
          <Col sm="3">
            <Form.Control as="select" value="USD" onChange={handleSetTo} />
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
      </Form>

      <Modal
        data-testid="modal"
        show={showModal}
        style={{ color: "#22" }}
        onHide={handleCloseModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Conversion</Modal.Title>
        </Modal.Header>
        <Modal.Body>{result}</Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCloseModal} variant="success">
            New conversion
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default App;

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
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    [value, from, to, carryOutConversion]
  );

  return (
    <div>
      <form
        onSubmit={handleConversion}
        noValidate
        validated={formValidity}
      ></form>
    </div>
  );
}

export default App;

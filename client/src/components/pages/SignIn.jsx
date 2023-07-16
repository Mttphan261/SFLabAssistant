import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Container } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import UserContext from "../../context/UserContext";

function SignIn() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const initialValues = {
    username: "",
    password: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = (values) => {
    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((r) => r.json())
      .then((user) => {
        setUser(user);
        navigate("/");
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <Row>
        <Col md={4} className="signup-image-col">
          <img
            src="https://raw.githubusercontent.com/Mttphan261/SFLabAssistant/main/.github/imgs/SignupPage/ryu%20world%20tour%20crop.png"
            alt="Signin"
            className="signup-image"
          />
        </Col>
        <Col md={8}>
          <div className="form-styling">
            <Col className="test">
            <h2>Step into the Ring</h2>
              <h5>Login:</h5>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                <Form>
                  <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <Field
                      type="text"
                      name="username"
                      id="username"
                      className="form-field form-control"
                    />
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="error-message"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <Field
                      type="password"
                      name="password"
                      id="password"
                      className="form-field form-control"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="form-group"
                    />
                  </div>
                  <button type="submit">Login</button>
                </Form>
              </Formik>
              <p>
                Don't have an account?
                <span
                  style={{ cursor: "pointer", "margin-left": "30px" }}
                  onClick={() => navigate("/signup")}
                >
                  Sign Up
                </span>
              </p>
            </Col>
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default SignIn;

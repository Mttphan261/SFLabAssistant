import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Container } from "react-bootstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import UserContext from "../../context/UserContext";

function SignUp() {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const initialValues = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string().required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const handleSubmit = (values) => {
    fetch("/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((response) => response.json())
      .then((user) => {
        setUser(user); // Updated: Use setUser to update user data
        navigate("/");
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      <Row>
      <Col md={4} className="signup-image-col">
        <img 
          src ="https://raw.githubusercontent.com/Mttphan261/SFLabAssistant/main/.github/imgs/SignupPage/chun%20li%20world%20tour%20crop.png"
          alt="Signup"
          className="signup-image"
        />
      </Col>
        <h2>Signup</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          <Form>
            <div>
              <label htmlFor="email">Email:</label>
              <Field
                type="text"
                name="email"
                id="email"
                className="form-field"
              />
              <ErrorMessage name="email" component="div" />
            </div>
            <div>
              <label htmlFor="username">Username:</label>
              <Field
                type="text"
                name="username"
                id="username"
                className="form-field"
              />
              <ErrorMessage name="username" component="div" />
            </div>
            <div>
              <label htmlFor="password">Password:</label>
              <Field
                type="password"
                name="password"
                id="password"
                className="form-field"
              />
              <ErrorMessage name="password" component="div" />
            </div>
            <div>
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <Field
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                className="form-field"
              />
              <ErrorMessage name="confirmPassword" component="div" />
            </div>
            <button type="submit">Submit</button>
          </Form>
        </Formik>
      </Row>
    </div>
  );
}

export default SignUp;

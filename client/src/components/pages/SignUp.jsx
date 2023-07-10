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
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form>
          <div>
            <label htmlFor="email">Email:</label>
            <Field type="text" name="email" id="email" />
            <ErrorMessage name="email" component="div" />
          </div>
          <div>
            <label htmlFor="username">Username:</label>
            <Field type="text" name="username" id="username" />
            <ErrorMessage name="username" component="div" />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <Field type="password" name="password" id="password" />
            <ErrorMessage name="password" component="div" />
          </div>
          <div>
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <Field
              type="password"
              name="confirmPassword"
              id="confirmPassword"
            />
            <ErrorMessage name="confirmPassword" component="div" />
          </div>
          <button type="submit">Submit</button>
        </Form>
      </Formik>
    </div>
  );
}

export default SignUp;

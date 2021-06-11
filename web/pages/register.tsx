import { Field, Formik } from "formik";
import Router from "next/router";
import React from "react";
import { InputField } from "../components/inputField";
import Layout from "../components/Layout";
import { RegisterComponent } from "../generated/apolloComponents";

const register = () => {
  return (
    <Layout title="Register">
      <RegisterComponent>
        {(register: any) => (
          <Formik
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={async (data: any) => {
              const response = await register({
                variables: { data },
              });

              if (response && response.data && !response.data.login) {
                return;
              }

              Router.replace("/auth");
            }}
            initialValues={{
              email: "",
              password: "",
              firstName: "",
              lastName: "",
            }}
          >
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Field
                  name="firstName"
                  placeholder="first name"
                  component={InputField}
                />
                <Field
                  name="lastName"
                  placeholder="last name"
                  component={InputField}
                />
                <Field
                  name="email"
                  placeholder="email"
                  component={InputField}
                />
                <Field
                  name="password"
                  placeholder="password"
                  type="password"
                  component={InputField}
                />
                <button type="submit">Login</button>
              </form>
            )}
          </Formik>
        )}
      </RegisterComponent>
    </Layout>
  );
};

export default register;

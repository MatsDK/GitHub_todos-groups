import { Field, Formik } from "formik";
import React from "react";
import { InputField } from "../components/inputField";
import Layout from "../components/Layout";
import { LoginComponent } from "../generated/apolloComponents";
import Router from "next/router";

const login = () => {
  return (
    <Layout title="Login">
      <LoginComponent>
        {(login: any) => (
          <Formik
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={async (data: any) => {
              const response = await login({
                variables: data,
              });

              console.log(response);
              if (response && response.data && !response.data.login) {
                return;
              }

              Router.replace("/auth");
            }}
            initialValues={{
              email: "",
              password: "",
            }}
          >
            {({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
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
      </LoginComponent>
    </Layout>
  );
};

export default login;

import { Field, Formik } from "formik";
import Link from "next/link";
import React from "react";
import { InputField } from "../src/components/Forms/inputField";
import Layout from "../src/components/Layout";
import { LoginComponent } from "../generated/apolloComponents";
import { withApollo } from "react-apollo";
import { ApolloClient } from "@apollo/client";
import Router from "next/router";

const Login = ({ client }: { client: ApolloClient<any> }): any => {
  return (
    <Layout title="Login">
      <LoginComponent>
        {(login) => (
          <Formik
            validateOnBlur={false}
            validateOnChange={false}
            onSubmit={async (data) => {
              const response = await login({
                variables: data,
              });

              if (response && response.data && !response.data.login) {
                return;
              }

              await client.resetStore();
              Router.push("/dashboard");
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
      <Link href="/register">
        <div>
          <h3>Register</h3>
        </div>
      </Link>
    </Layout>
  );
};

export default withApollo(Login);

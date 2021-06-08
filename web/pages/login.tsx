import React from "react";
import Layout from "../components/Layout";
import { LoginComponent } from "../generated/apolloComponents";

const login = () => {
  return (
    <Layout title="Login">
      <LoginComponent>
        {(mutate) => (
          <button
            onClick={async () => {
              const response = await mutate({
                variables: { email: "bob2@bob.com", password: "bob" },
              });

              console.log(response);
            }}
          >
            call login mutation
          </button>
        )}
      </LoginComponent>
    </Layout>
  );
};

export default login;

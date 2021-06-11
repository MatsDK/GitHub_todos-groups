import React from "react";
import Layout from "../components/Layout";
import { withAuth } from "../lib/HOC/withAuth";

const auth: any = () => {
  // console.log(data);
  return <Layout title="withAuthPage">Auth</Layout>;
};

export default withAuth(auth);

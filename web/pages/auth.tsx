import React from "react";
import Layout from "../components/Layout";
import { withAuth } from "../lib/HOC/withAuth";

interface authPageProps {
  me: {
    name: string;
    email: string;
    id: string;
  };
}

const auth: any = ({ me }: authPageProps) => {
  return (
    <Layout title="withAuthPage">
      <div>
        <span>{me.name}</span>
      </div>
      <div>
        <span>{me.email}</span>
      </div>
    </Layout>
  );
};

export default withAuth(auth);

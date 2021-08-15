import * as React from "react";
import { withAuth } from "../lib/HOC/withAuth";
import { useRouter } from "next/router";
import { useEffect } from "react";

const IndexPage: React.FunctionComponent = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/dashboard");
    return () => {};
  }, []);

  return null;
};

export default withAuth(IndexPage);

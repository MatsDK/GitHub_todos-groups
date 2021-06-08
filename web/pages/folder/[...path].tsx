import React from "react";
import { useRouter } from "next/router";

const Repo: React.FC = () => {
  const router = useRouter();
  console.log(router.query);

  return <div>hello world</div>;
};

export default Repo;

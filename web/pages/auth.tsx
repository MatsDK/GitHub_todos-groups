import Layout from "../components/Layout";
import { withAuth } from "../lib/withAuth";

const auth = () => {
  return <Layout title="withAuthPage">Auth</Layout>;
};

export default withAuth(auth);

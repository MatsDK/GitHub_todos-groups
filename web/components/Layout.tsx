import * as React from "react";
import Link from "next/link";
import Head from "next/head";

type Props = {
  title?: string;
};

const Layout: React.FunctionComponent<Props> = ({
  children,
  title = "Home",
}) => (
  <div>
    <Head>
      <title>{title}</title>
      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <nav style={{ display: "flex" }}>
      <Link href="/">
        <div>
          <h3>Home</h3>
        </div>
      </Link>
      <Link href="/login">
        <div>
          <h3>Login</h3>
        </div>
      </Link>
      <Link href="/register">
        <div>
          <h3>Register</h3>
        </div>
      </Link>
      <Link href="/folder/id1/id2">
        <div>
          <h3>random page</h3>
        </div>
      </Link>
      <Link href="/dashboard">
        <div>
          <h3>Dashboard</h3>
        </div>
      </Link>
      <Link href="/logout">
        <div>
          <h3>logout</h3>
        </div>
      </Link>
    </nav>
    {children}
  </div>
);

export default Layout;

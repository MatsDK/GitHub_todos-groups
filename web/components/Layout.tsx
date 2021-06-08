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
        <h3>Home</h3>
      </Link>
      <Link href="/login">
        <h3>Login</h3>
      </Link>
      <Link href="/folder/id1/id2">
        <h3>random page</h3>
      </Link>
    </nav>
    {children}
  </div>
);

export default Layout;

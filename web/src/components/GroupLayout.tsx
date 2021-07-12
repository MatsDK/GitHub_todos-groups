import React from "react";
import { MeMe } from "../../generated/apolloComponents";
import Head from "next/head";
import Picture from "../ui/Picture";
import styled from "styled-components";

interface Props {
  me: null | MeMe;
  title: string;
}

const Page = styled.div`
  max-width: 1300px;
  padding: 20px;
  height: 100vh;
  overflow: auto;
  margin: 0 auto;
`;

const Navbar = styled.div`
  display: flex;
  justify-content: flex-end;
  padding: 0 30px;
`;

const Profile = styled.div`
  display: flex;
  align-items: center;

  span {
    font-size: 20px;
    margin-left: 10px;
    color: ${(props) => props.theme.textColors[1]};
  }
`;

const GroupLayout: React.FC<Props> = ({ children, title, me }) => {
  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Page>
        <Navbar>
          {me && (
            <Profile>
              {me.pictureUrl && <Picture src={me.pictureUrl} />}
              <span>{me.name}</span>
            </Profile>
          )}
        </Navbar>

        {children}
      </Page>
    </div>
  );
};

export default GroupLayout;

import React from "react";
import styled from "styled-components";
import { CloseIcon } from "./icons";
import { Formik, Field } from "formik";
import { InputField } from "./Forms/inputField";
import { Button } from "../ui/Button";
import { InviteUserComponent } from "../../generated/apolloComponents";

interface Props {
  groupId: number;
  closeForm: () => void;
}

const InviteWrapper = styled.div`
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  display: grid;
  place-items: center;
`;

const InviteInner = styled.div`
  width: 400px;
  max-height: 200px;
  min-height: 200px;
  background-color: ${(props) => props.theme.secondaryBgColor};
  padding: 10px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  border-radius: 3px;

  h1 {
    margin: 0;
  }

  div {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;

const Label = styled.p`
  font-size: 20px;
  margin: 10px 0 5px 0;
  color: ${(props) => props.theme.textColors[2]};
`;

const Invite: React.FC<Props> = ({ closeForm, groupId }) => {
  return (
    <InviteWrapper
      onClick={(e) => {
        if (e.target == e.currentTarget) closeForm();
      }}
    >
      <InviteInner>
        <div style={{ marginBottom: 20 }}>
          <h1>Invite</h1>
          <div onClick={() => closeForm()}>
            <CloseIcon />
          </div>
        </div>
        <InviteUserComponent>
          {(inviteUser) => (
            <Formik
              validateOnBlur={false}
              enableReinitialize={true}
              validateOnChange={false}
              onSubmit={async (data) => {
                if (!data.email.trim().length) return;

                const res = await inviteUser({
                  variables: { groupId, userEmail: data.email },
                });
                if (!res || !res.data || !res.data.inviteUser) return;

                console.log(res.data);
              }}
              initialValues={{
                email: "",
              }}
            >
              {({ handleSubmit }) => (
                <form onSubmit={handleSubmit} style={{ flex: "1" }}>
                  <Label>User's Email</Label>
                  <Field
                    name="email"
                    placeholder="email"
                    component={InputField}
                  />
                  <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button type="submit">Invite User</Button>
                  </div>
                </form>
              )}
            </Formik>
          )}
        </InviteUserComponent>
      </InviteInner>
    </InviteWrapper>
  );
};

export default Invite;

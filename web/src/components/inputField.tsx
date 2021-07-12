import { FieldProps } from "formik";
import React, { DetailedHTMLProps, InputHTMLAttributes } from "react";
import styled from "styled-components";

type InputProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;
// | DetailedHTMLProps<
//     InputHTMLAttributes<HTMLTextAreaElement>,
//     HTMLTextAreaElement
//   >;

const Input = styled.div`
  input {
    font-size: 21px;
    outline: none;
    color: ${(props) => props.theme.textColors[1]};
    background: transparent;
    border: 2px solid ${(props) => props.theme.mainBgColor};
    width: calc(100% - 20px);
    padding: 2px 10px;
  }
`;

export const InputField = ({
  field,
  form: { errors, touched },
  ...props
}: FieldProps & InputProps) => {
  const errorMessage = touched[field.name] && errors[field.name];

  return (
    <div>
      <Input>
        <input {...field} placeholder={props.placeholder} />
      </Input>
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
    </div>
  );
};

const Textarea = styled.textarea`
  width: 100%;
  resize: vertical;
  max-height: 400px;
  min-height: 150px;
  flex: 1;
  font-size: 18px;
  outline: none;
  color: ${(props) => props.theme.textColors[1]};
  background: transparent;
  border: 2px solid ${(props) => props.theme.mainBgColor};
  width: calc(100% - 20px);
  padding: 2px 10px;
`;

export const TextAreaField = ({
  field,
  form: { errors, touched },
  ...props
}: FieldProps & InputProps) => {
  const errorMessage = touched[field.name] && errors[field.name];

  return (
    <div>
      <Textarea placeholder={props.placeholder} {...field} />
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
    </div>
  );
};

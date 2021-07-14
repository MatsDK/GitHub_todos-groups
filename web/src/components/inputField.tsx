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
  width: 100%;
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
  setValue,
  ...props
}: FieldProps & InputProps & { setValue: any }) => {
  const errorMessage = touched[field.name] && errors[field.name];

  return setValue ? (
    <div>
      <Input>
        <input
          {...field}
          onChange={(e) => {
            setValue(e.target.value);
            field.onChange(e);
          }}
          placeholder={props.placeholder}
        />
      </Input>
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
    </div>
  ) : (
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
  setValue,
  ...props
}: FieldProps & InputProps & { setValue: any }) => {
  const errorMessage = touched[field.name] && errors[field.name];

  return (
    <div>
      <Textarea
        placeholder={props.placeholder}
        {...field}
        onChange={(e) => {
          setValue(e.target.value);
          field.onChange(e);
        }}
      />
      {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}
    </div>
  );
};

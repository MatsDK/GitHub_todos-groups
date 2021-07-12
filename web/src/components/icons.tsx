import styled from "styled-components";

const ArrowSVG = styled.svg`
  rect {
    fill: ${(props) => props.theme.textColors[2]};
  }
`;

export const PathArrow = () => {
  return (
    <ArrowSVG
      width="5.5"
      height="10.5"
      style={{ margin: "0 10px" }}
      viewBox="0 0 11 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="2.21831"
        height="14.0493"
        transform="matrix(-0.668964 -0.743295 0.668964 -0.743295 1.60153 21)"
      />
      <rect
        width="2.21831"
        height="14.1848"
        transform="matrix(0.668964 -0.743295 0.668964 0.743295 0 1.64886)"
      />
    </ArrowSVG>
  );
};

const MenuSVG = styled.svg`
  circle {
    fill: ${(props) => props.theme.textColors[2]};
  }
`;

export const MenuDots = () => {
  return (
    <MenuSVG
      width="3"
      height="13"
      viewBox="0 0 3 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="1.5" cy="1.5" r="1.5" />
      <circle cx="1.5" cy="6.5" r="1.5" />
      <circle cx="1.5" cy="11.5" r="1.5" />
    </MenuSVG>
  );
};

const CloseIconSVG = styled.svg`
  cursor: pointer;
  rect {
    fill: ${(props) => props.theme.textColors[1]};
  }
`;

export const CloseIcon = () => {
  return (
    <CloseIconSVG
      width="21"
      height="21"
      viewBox="0 0 21 21"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="26.2791"
        height="3"
        transform="matrix(0.707106 -0.707108 0.707106 0.707108 0 18.5822)"
      />
      <rect
        width="26.2791"
        height="3"
        transform="matrix(0.707106 -0.707108 0.707106 0.707108 0 18.5822)"
      />
      <rect
        width="26.2791"
        height="3"
        transform="matrix(0.707106 -0.707108 0.707106 0.707108 0 18.5822)"
      />
      <rect
        width="26.2791"
        height="3"
        transform="matrix(0.707106 0.707108 -0.707106 0.707108 2.41785 7.62939e-06)"
      />
      <rect
        width="26.2791"
        height="3"
        transform="matrix(0.707106 0.707108 -0.707106 0.707108 2.41785 7.62939e-06)"
      />
      <rect
        width="26.2791"
        height="3"
        transform="matrix(0.707106 0.707108 -0.707106 0.707108 2.41785 7.62939e-06)"
      />
    </CloseIconSVG>
  );
};

const FilesSVG = styled.svg`
  margin-right: 5px;

  path {
    fill: ${(props) => props.theme.textColors[1]};
  }
`;

export const FolderIcon = () => {
  return (
    <FilesSVG
      width="20"
      height="18"
      viewBox="0 0 20 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M18 2H8.414L6.707 0.293001C6.61426 0.200002 6.50406 0.126244 6.38273 0.0759616C6.2614 0.0256795 6.13134 -0.000135141 6 5.32017e-07H2C0.897 5.32017e-07 0 0.897 0 2V16C0 17.103 0.897 18 2 18H18C19.103 18 20 17.103 20 16V4C20 2.897 19.103 2 18 2Z" />
    </FilesSVG>
  );
};

export const FileIcon = () => {
  return (
    <FilesSVG
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M19.937 8.68C19.926 8.648 19.917 8.617 19.904 8.586C19.8566 8.47747 19.7902 8.37825 19.708 8.293L13.708 2.293C13.6228 2.21078 13.5235 2.14441 13.415 2.097C13.385 2.083 13.353 2.075 13.321 2.064C13.2373 2.03553 13.1502 2.01837 13.062 2.013C13.04 2.011 13.021 2 13 2H6C4.897 2 4 2.897 4 4V20C4 21.103 4.897 22 6 22H18C19.103 22 20 21.103 20 20V9C20 8.979 19.989 8.96 19.987 8.938C19.9819 8.85016 19.9651 8.7634 19.937 8.68V8.68ZM16.586 8H14V5.414L16.586 8ZM6 20V4H12V9C12 9.26522 12.1054 9.51957 12.2929 9.70711C12.4804 9.89464 12.7348 10 13 10H18L18.002 20H6Z" />
    </FilesSVG>
  );
};

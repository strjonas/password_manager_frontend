export const REACT_APP_API =
  process.env.NODE_ENV === "development"
    ? "http://192.168.178.41:5000"
    : "https://webapi.herokuapp.com";

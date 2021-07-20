export const REACT_APP_API =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://webapi.herokuapp.com";

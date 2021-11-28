export const SERVER_BASE_URL =
  process.env.NODE_ENV === "production"
    ? `https://toptrips.herokuapp.com/api`
    : "http://localhost:4000/api";
export const SERVER_SOCKET_URL =
  process.env.NODE_ENV === "production"
    ? `wss://toptrips.herokuapp.com/`
    : `ws://localhost:4000`;

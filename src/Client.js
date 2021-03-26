const baseUrl = "https://opensky-network.org/api/flights";

const client = {
  getArrivals: (username, password, airport, begin, end) => {
    const start = Date.parse(begin) / 1000;
    const stop = Date.parse(end) / 1000;
    return fetch(
      `${baseUrl}/arrival/?airport=${airport}&begin=${start}&end=${stop}`,
      {
        method: "GET",
        headers: {
          cors: "cors",
          Authorization: `Basic ${btoa(username + ":" + password)}`,
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
      }
    );
  },
  getDepartures: (username, password, airport, begin, end) => {
    const start = Date.parse(begin) / 1000;
    const stop = Date.parse(end) / 1000;
    return fetch(
      `${baseUrl}/departure/?airport=${airport}&begin=${start}&end=${stop}`,
      {
        method: "GET",
        headers: {
          cors: "cors",
          Authorization: `Basic ${btoa(username + ":" + password)}`,
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
      }
    );
  },
};

export default client;

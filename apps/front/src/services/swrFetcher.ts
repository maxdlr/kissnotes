import axios from "axios";

const swrFetcher = ([url, body]: [string, unknown]) =>
  axios.get(url, { data: body }).then((res) => res.data);
export default swrFetcher;

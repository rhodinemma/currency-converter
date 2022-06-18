import { FIXER_API_KEY } from "../config";
import axios from "axios";

export const convertCurrency = (amount) => {
  const response = axios.get(
    `https://api.apilayer.com/fixer/convert?to=USD&from=UGX&amount={amount}`,
    FIXER_API_KEY,
    amount
  );
  console.log(response);
  return response.json();
};

import { ExchangeRates } from "./types/ExchangeRates";

const a: ExchangeRates = {
  table: "",
  code: "",
  currency: "",
  rates: [
    {
      no: "",
      effectiveDate: "2022-03-23",
      mid: 5.3424,
    },
  ],
};
//control + spacja wyświetlają podpowiedzi, a jak są na końcu, to strzałka do góry pozwala się do nich szybko dostać

const b: ExchangeRates = {
  table: "",
  code: "",
  currency: "",
  rates: [
    {
      no: "",
      effectiveDate: "2022-03-16",
      mid: 4.1224,
    },
  ],
};

const calculateRateDifference = (a: ExchangeRates, b: ExchangeRates) => {
  const rateA = a.rates[0].mid *4;
  const rateB = b.rates[0].mid *4;
  const result = +((rateA - rateB)/4).toFixed(2)
  return result
};
//toFixed obcina, ale nie zaokrągla

describe("exchange difference", () => {
  it("correctly count difference between rates", () => {
    expect(calculateRateDifference(a, b)).toBe(1.22);
  });
});

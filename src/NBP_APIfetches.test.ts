import fetch from "node-fetch";

test.skip("gets data of current USD course", async () => {
  const response = await fetch(
    "http://api.nbp.pl/api/exchangerates/rates/A/usd/2022-03-23/?format=json"
  );
  const data = await response.text();

  console.log(data);
  //to są tzw. discovery tests, używamy go do poznawania świata
});

test.skip("gets data of last week USD course", async () => {
    const response = await fetch(
      "http://api.nbp.pl/api/exchangerates/rates/A/usd/2022-02-16/?format=json"
    );
    const data = await response.json() as ICurrencyRate;
  
    console.log(data);
  }); 

  test.skip("gets data of last month USD course", async () => {
    const response = await fetch(
      "http://api.nbp.pl/api/exchangerates/rates/A/usd/2022-02-23/?format=json"
    );
    const data = await response.json() as ICurrencyRate;
  
    console.log(data);
  });

test.skip("gets data of current EUR course", async () => {
  const response = await fetch(
    "http://api.nbp.pl/api/exchangerates/rates/A/eur/2022-02-21/2022-03-23/?format=json"
  );
  const data = await response.json() as ICurrencyRate;

  console.log(data);
});


interface ICurrencyRate {
  table: Tables;
  currency: string;
  code: string;
  rates: IRate[]; //"IRates" nie, bo nie robi się w liczbie mnogiej i nie "IRatesArray", bo to wtedy REDUNDANTNE
}

interface IRate {
  no: string;
  effectiveDate: string; //mógłby to być date lub string
  mid: number;
}

type Tables = "A"|"B"|"C"
type Currency = "USD"|"EUR"


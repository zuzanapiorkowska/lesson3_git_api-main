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


//   const USDdata: CurrencyRate = {
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

//instancjonuję input, bo musze wybrac sobie język, bo quicktype też działa dla C#, javy etc/
// póżniej dodaję źródło - plik źródłowy
// później tworzę kolejny obiekt, do którego później przekazuję wiele json inputów
//później wołam awaitem funckję quicktype
// renderer-options - jeśli tego nie przekażę, to zwróci duże rzeczy, które mamy w dupce 

// później ten serializedResult ma SVGFEDiffuseLightingElement, joinuję po linii i znowu powinienem dostać ten sam text

// w path sobie robię gdzie te typy mają się wytworzyć


// generateTypes 

//w fetchu możemy też dodać inne rzeczy, np. headery czy coś, co pozwala na autentykację


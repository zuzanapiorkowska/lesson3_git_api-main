import { ExchangeRates } from "./types/ExchangeRates";
const nock = require("nock");
import fetch from "node-fetch";
import fs from "fs";
import { resolve as resolvePath } from "path";

const calculateRateDifference = (
  a: ExchangeRates,
  b: ExchangeRates
): number => {
  const rateA = a.rates[0].mid * 1000;
  const rateB = b.rates[0].mid * 1000;
  //mnożymy *1000, żeby odejmowanie przeprowadzić na liczbach całkowitych, bo na takich po przecinku się wykrzaczy
  const result = +((rateA - rateB) / 1000).toFixed(2);
  //toFixed obcina, ale nie zaokrągla i zwraca wartość w stringu
  return result;
};

async function getCurrencyData(
  date: string,
  currency: string
): Promise<ExchangeRates> {
  const response = await fetch(
    `http://api.nbp.pl/api/exchangerates/rates/a/${currency}/${date}?format=json`
  );
  //fetcha możemy zostawić w tym teście, bo on tu nic nie przeszkadza
  const data = (await response.json()) as ExchangeRates;
  // (await Response.json()) musi być w nawiasie przy typowaniu "as....", bo inaczej byłoby typowanie unknown
  const rate = data.rates[0].mid;
  return data;
}

async function getCurrencyDifferenceBetweenDates(
  date1: string,
  date2: string,
  currency: string
): Promise<number> {
  const rate1 = await getCurrencyData(date1, currency);
  const rate2 = await getCurrencyData(date2, currency);
  const difference = calculateRateDifference(rate1, rate2);
  return difference;
}

//request recording - robimy sobie request do API i zapisujemy, jakby "nagrywamy" sobie ten request, żeby później to pobieranie zafejkować
//reqiesty i responsy można zamockować, ale często jest trudno, bo są skomplikowane, mogą mieź headery, mogą się wywalać, bo za długo, możgą zwracać string etc. mockowanie tej zależności, którą jest to zewnętrzne api (ten request) jest bardzo trudne

//zamiast tego możemy zrobić fetcha, bierzemy odpowiedź i zapiszmy to i z tego robimy plik z przykładowym API
//później sprawdzamy czy poszedł z tymi samymi parametrami -> np. fetch z parametrami accept json. nie tworzymy raw requestu (w takiej formie)

//biblioteka nock umożliwia recordowanie tych requestów

//za pierwszym razem robimy request tak po prostu
//a za drugim razem już taki fejkowy

function saveRecordings(tapeName: string) {
  return new Promise<void>((resolve) => {
  fs.mkdir(resolvePath(__dirname, "__tapes__"), ()=> {
      //podłogapodłoga w nazwie directory sugeruje, że to dane do testów
    fs.writeFile(resolvePath(__dirname, "__tapes__", `${tapeName}.json`), JSON.stringify(nock.recorder.play()), ()=>{
      //możemy tu zwrócić promisa jak to się wykona
      resolve();
    })
  })
})
}

async function saveRecordings2(dirName: string, tapeName: string) {
  try {
    await fs.promises.mkdir(resolvePath(dirName, "__tapes__"));
  } catch {}
  //nowsze wersje node'a mają taką opcję, żeby zrobić to tak zamiast promise'a
  try {
    await fs.promises.writeFile(
      resolvePath(dirName, "__tapes__", `${tapeName}.json`),
      JSON.stringify(nock.recorder.play())
    );
  } catch {}
}

describe("exchange difference", () => {
  beforeEach(() => nock.disableNetConnect());
  //po dodaniu tylko i wyłącznie tego test się wywali, no bo nie ma neta
  afterEach(() => nock.enableNetConnect());
  it("correctly get current usd dollar exchange rate", async () => {
    // nock.recorder.rec()
    // takie coś nam powyżej nam zwróci loada w konsoli
    //   nock.recorder.rec({ output_objects: true, dont_print: true });
    //dzięki zawartości obiektu dostajemy jsona => output_objects to sprawia
    //z tym recorderem sobie puszczam testtylko raz, no bo ma się nagrać, a jak już jest nagrane, no to nie trza
    //jak już się puści, hehe, to przekopiowujemy odpowiedź do oddzielnego pliku (u mnie exchangeRates.tape.json) i wrzucamy ścieżkę do niego w "load", poniżej
    nock.load(`${__dirname}/__tapes__/usd.json`);
    // tutaj powyżej trzeba będzie zmienić nazwę
    const data = await getCurrencyData("2022-03-23", "usd");
    expect(data.rates[0].mid).toBe(4.2772);
    //   await saveRecordings2(`${__dirname}`, "usd"); //jest promisem, bo tworzenie i zapisywanie plików jest asunchroniczne i wymaga callcaków
    //   console.log(nock.recorder.play();
    //to nam pokaże wszystkie requesty z testu
  }),
    it("correctly get usd dollar exchange rate from past date", async () => {
      nock.load(`${__dirname}/__tapes__/usd2.json`);
      const data = await getCurrencyData("2022-03-16", "usd");
      expect(data.rates[0].mid).toBe(4.2828);
    }),
    it("correctly counts difference between rates", async () => { 
      expect(
        await getCurrencyDifferenceBetweenDates("2022-03-23", "2022-03-16", "usd")
      ).toBe(-0.01);
    });
});

//najpierw z wyłączonym beforeEachem i afterEachem:
//     nock.recorder.rec({ output_objects: true, dont_print: true });
//     const data = await getCurrencyData("2022-03-16", "usd");
//     await saveRecordings2(`${__dirname}`, "usd2");

//a później robię tak z włączonymi beforeEach i afterEach
// nock.recorder.rec({ output_objects: true, dont_print: true });
// nock.load(`${__dirname}/__tapes__/usd2.json`);
// const data = await getCurrencyData("2022-03-16", "usd");
// expect(data.rates[0].mid).toBe(4.2828);


//łatwiej by było
//sprawdź czy jest plik z nagraniem
//jeśli nie ma: włącz Internet, zacznij nagrywanie, puść kod i zapisz
//jeśli jest: wyłącz Internet, odpal dane z pliku, załaduj kasetę, puść kod i włącz internet


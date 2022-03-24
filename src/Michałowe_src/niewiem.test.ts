import { appendFile, fstat } from "fs";
import { ExchangeRates } from "./types/ExchangeRates";
const nock = require("nock");
import fetch from "node-fetch";
import fs from "fs";
import { json } from "stream/consumers";
import { resolve as resolvePath } from "path";

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
  const rateA = a.rates[0].mid * 1000;
  const rateB = b.rates[0].mid * 1000;
  //mnożymy *1000, żeby odejmowanie przeprowadzić na liczbach całkowitych, bo na takich po przecinku się wykrzaczy
  const result = +((rateA - rateB) / 1000).toFixed(2);
  //toFixed obcina, ale nie zaokrągla i zwraca wartość w stringu
  return result;
};

function saveRecordings(tapeName: string) {
  return new Promise<void>((resolve) => {
  fs.mkdir(resolvePath(__dirname, "__tapes__"), ()=> {
    fs.writeFile(resolvePath(__dirname, "__tapes__", `${tapeName}.json`), JSON.stringify(nock.recorder.play()), ()=>{
      //możemy tu zwrócić promisa jak to się wykona
      resolve();
    })
  })
  //podłogapodłoga sugeruje, że to dane do testów
})
}


export async function saveRecordings2(dirName: string, tapeName: string) {
try {
  await fs.promises.mkdir(resolvePath(dirName, "__tapes3__"))
}catch{}
  //nowsze wersje node'a mają taką opcję, żeby zrobić to tak zamiast promise'a
  await fs.promises.writeFile(
    resolvePath(dirName, "__tapes3__", `${tapeName}.json`),
    JSON.stringify(nock.recorder.play())
  );
}

describe("exchange difference", () => {
  // beforeEach(()=> nock.disableNetConnect());
  //po dodaniu tylko i wyłącznie tego test się wywali, no bo nie ma neta
  // afterEach(()=> nock.enableNetConnect());
  it("correctly count difference between rates", async () => {
    // nock.recorder.rec()
    // takie coś nam powyżej nam zwróci loada w konsoli
    nock.recorder.rec({output_objects: true, dont_print: true});
    //dzięki zawartości obiektu dostajemy jsona => output_objects to sprawia
    //z tym recorderem sobie puszczam testtylko raz, no bo ma się nagrać, a jak już jest nagrane, no to nie trza
    //jak już się puści, hehe, to przekopiowujemy odpowiedź do oddzielnego pliku (u mnie exchangeRates.tape.json) i wrzucamy ścieżkę do niego w "load", poniżej
    // nock.load(`${__dirname}/nocks/exchangeRates.tape.json`);
    const response = await fetch(
      "http://api.nbp.pl/api/exchangerates/rates/a/usd/2016-04-04/?format=json"
    );
    //fetcha możemy zostawić, bo on tu nic nie przeszkadza
    const data = (await response.json()) as ExchangeRates;
    //pobieranie data wynieść do oddzielnej funkcji by fajnie było
    expect(calculateRateDifference(a, b)).toBe(1.22);
    await saveRecordings2(`${__dirname}`, "usd7"); //jest promisem, bo tworzenie i zapisywanie plików jest asunchroniczne i wymaga callcaków
    console.log(nock.recorder.play())
    //to nam pokaże wszystkie requesty z testu
  });
});

//request recording - robimy sobie request do API i zapisujemy, jakby "nagrywamy" sobie ten request, żeby później to pobieranie zafejkować
//reqiesty i responsy można zamockować, ale często jest trudno, bo są skomplikowane, mogą mieź headery, mogą się wywalać, bo za długo, możgą zwracać string etc.
//mockowanie tej zależności, którą jest to zewnętrzne api (ten request)jest bardzo trudne

//zamiast tego możemy zrobić fetcha, bierzemy odpowiedź i zapiszmy to i z tego robimy plik z przykładowym API
//później sprawdzamy czy poszedł z tymi samymi parametrami -> np. fetch z parametrami accept json. nie tworzymy raw requestu (w takiej formie)

//biblioteka nock umożliwia recordowanie tych requestów

// po requescie który róbimy, możemy sobie zrobić expecta

// (await Response.json()) musi być w nawiasie przy typowanie "as....", bo inaczej byłoby

//za pierwszym razem robimy request tak po prostu
//a za drugim razem już taki fejkowy
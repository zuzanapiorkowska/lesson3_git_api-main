import {
  InputData,
  jsonInputForTargetLanguage,
  quicktype,
} from "quicktype-core";
import fs from "fs";
import fetch from "node-fetch";

export const generateTypes = async (url: string, name: string) => {
    // name jako nazwa pliku, w którym mają się wytworzyć typy, np. generateTypes 
  const response = await fetch(url);
  //w fetchu możemy też dodać inne rzeczy, np. headery czy coś, co pozwala na autentykację
  const jsonString = await response.text();
  //text, bo mają być dokładnie takie jsonowe dane, jak dostaliśmy
  const jsonInput = jsonInputForTargetLanguage("typescript");
  //instancjonuję input, bo musze wybrac sobie język, bo quicktype też działa dla C#, javy etc
  await jsonInput.addSource({ name, samples: [jsonString] });
  //póżniej dodaję źródło - plik źródłowy
  const inputData = new InputData();
  //później tworzę nowy obiekt
  inputData.addInput(jsonInput);
  //do którego później przekazuję wiele json inputów
  const serializedRenderResult = await quicktype({
      //później wołam awaitem funckję quicktype
    inputData: inputData,
    lang: "typescript",
    rendererOptions: { "just-types": "true" },
    // rendererOptions - jeśli tego nie przekażę, to zwróci duże rzeczy, które mamy w dupce 
  });
  fs.writeFile(
    `${__dirname}/../types/${name}.ts`,
    // to jest path w projekcie, gdzie te typy mają się wytworzyć
    //uwaga! trzeba wyjść z tego folderu, w którymjestem do tyłu poprzez ".."
    serializedRenderResult.lines.join("\n"),
    // później ten serializedResult ma metodę lines, a później joinuję po linii i znowu powinienem dostać ten sam text
    (err) => {console.error(err);}
  );
};


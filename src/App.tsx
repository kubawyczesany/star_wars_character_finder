import React, { useState } from "react";
import CharacterList from "./components/CharacterList";
import Texts from "./texts/texts";
import "./styles/styles.css";

type Character = {
  name: string;
  homeworld: string;
  homeworldPopulation: string;
  films: string[];
  url: string;
};

type Planet = {
  name: string;
  population: string;
  residents: Array<any>;
  characters: Array<any>;
};

const App: React.FC = () => {
  const [searchInput, setSearchInput] = useState("");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [charactersByPlanet, setCharactersByPlanet] = useState<Planet[]>([]);
  const [charactersByPopulation, setCharactersByPopulation] = useState<
    Character[]
  >([]);

  const handleClick = async () => {
    try {
      let page = 1;
      let charactersData = [];
      let allCharacters: Character[] = [];
      let planetData = [];
      do {
        charactersData = await (
          await fetch(
            `https://swapi.dev/api/people/?page=${page}&search=${searchInput}`
          )
        ).json();
        if (charactersData.count === 0) {
          planetData = await (
            await fetch(`https://swapi.dev/api/planets/?search=${searchInput}`)
          ).json();
          if (planetData.count === 0) {
            let planetFound = null;
            let planetPage = 1;
            do {
              const planetsData = await (
                await fetch(`https://swapi.dev/api/planets/?page=${planetPage}`)
              ).json();
              planetFound = planetsData.results.find(
                (planet: Planet) => planet.population === searchInput
              );
              if (planetFound) break;
              planetPage++;
            } while (planetData.next);
            if (planetFound) {
              const characterPromises = planetFound.residents.map(
                async (url: string) => {
                  const characterData = await fetch(url).then((res) =>
                    res.json()
                  );
                  return characterData;
                }
              );
              const charactersByPlanetPopulation = await Promise.all(
                characterPromises
              );
              setCharactersByPopulation(charactersByPlanetPopulation);
              return;
            }
          } else {
            const charactersByPlanet = await Promise.all(
              planetData.results.map(async (planet: Planet) => {
                let characters = [];
                const characterPromises = planet.residents.map(
                  async (url: string) => {
                    const characterData = await fetch(url).then((res) =>
                      res.json()
                    );
                    return characterData;
                  }
                );
                characters = await Promise.all(characterPromises);
                return {
                  ...planet,
                  characters,
                };
              })
            );
            console.log(characters);
            setCharactersByPlanet(charactersByPlanet);
          }
        }
        allCharacters = [...allCharacters, ...charactersData.results];
        page++;
      } while (charactersData.next);
      setCharacters(allCharacters);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="container">
        <img src={Texts.imgLink} className="img"></img>
        <h1>{Texts.appname}</h1>
        <input
          className="search"
          type="search"
          placeholder="Search..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button className="btn" type="submit" onClick={handleClick}>
          {Texts.buttonPlaceholder}
        </button>
        <ul className="list">
          {characters &&
            characters.map((character) => (
              <CharacterList character={character} />
            ))}
          {charactersByPlanet &&
            charactersByPlanet.map((planet) =>
              planet.characters?.map((characters) => (
                <CharacterList character={characters} />
              ))
            )}
          {charactersByPopulation &&
            charactersByPopulation.map((character) => (
              <CharacterList character={character} />
            ))}
        </ul>
      </div>
    </>
  );
};

export default App;

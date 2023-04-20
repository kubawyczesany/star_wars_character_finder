import React, { useState } from "react";
import CharacterMovies from "./components/CharacterMovies";
import "./styles/styles.css";

type Character = {
  name: string;
  homeworld: string;
  homeworldPopulation: string;
  films: Film[];
  url: string;
};

type Film = {
  title: string;
  releaseDate: string;
  openingCrawl: string;
};

const App: React.FC = () => {
  const [searchInput, setSearchInput] = useState("");
  const [characters, setCharacters] = useState<Character[]>([]);
  const [charactersByPlanet, setCharactersByPlanets] = useState<Character[]>(
    []
  );

  const handleClick = async () => {
    try {
      const charactersData = await (
        await fetch(`https://swapi.dev/api/people/?search=${searchInput}`)
      ).json();
      setCharacters(charactersData.results);
      if (charactersData.count === 0) {
        const homeworldData = await (
          await fetch(`https://swapi.dev/api/planets/?search=${searchInput}`)
        ).json();
        let homeworld = homeworldData.results;
        let charactersHomeworldArr = [];
        for (let i = 0; i < Object.keys(homeworld).length; i++) {
          let homeworldResidents = homeworld[i].residents;
          for (let n = 0; n < Object.keys(homeworldResidents).length; n++) {
            const charactersHomeworld = await (
              await fetch(homeworldResidents[n])
            ).json();
            charactersHomeworldArr.push(charactersHomeworld);
          }
        }
        setCharactersByPlanets(charactersHomeworldArr);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div className="container">
        <input
          className="search"
          type="search"
          placeholder="Search..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <button className="btn" type="submit" onClick={handleClick}>
          Search
        </button>
        <ul className="list">
          {characters.map((character) => (
            <CharacterMovies character={character} />
          ))}
        </ul>
        <ul className="list">
          {charactersByPlanet.map((item, index) => (
            <li className="listItem" key={index}>
              {item.name}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default App;

import React, { useState } from "react";

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

// TODO: film object has links to another API (same logic as getting character by homeworld)

const CharacterMovies: React.FC<{ character: Character }> = ({ character }) => {
  const [showMovies, setShowMovies] = useState(false);

  const handleToggleMovies = () => {
    setShowMovies(!showMovies);
  };

  return (
    <li className="listItem" key={character.url} onClick={handleToggleMovies}>
      {character.name}
      {showMovies && (
        <ul>
          {character.films.map((film, index) => (
            <li key={index}>
              <h3>{film.title}</h3>
              <p>Release date: {film.releaseDate}</p>
              <p>Opening crawl: {film.openingCrawl?.slice(0, 130)}</p>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

export default CharacterMovies;

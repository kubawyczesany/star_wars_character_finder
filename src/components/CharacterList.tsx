import React, { useState, useEffect } from "react";

type Character = {
  name: string;
  homeworld: string;
  homeworldPopulation: string;
  films: string[];
  url: string;
};

type Film = {
  title: string;
  release_date: string;
  opening_crawl: string;
};

const CharacterList: React.FC<{ character: Character }> = ({ character }) => {
  const [showfilms, setShowfilms] = useState(false);
  const [films, setfilms] = useState<Film[]>([]);

  useEffect(() => {
    const fetchfilms = async () => {
      const filmPromises = character.films.map((filmUrl) =>
        fetch(filmUrl).then((res) => res.json())
      );
      const filmData = await Promise.all(filmPromises);
      setfilms(filmData);
    };
    fetchfilms();
  }, [character]);

  const handleTogglefilms = () => {
    setShowfilms(!showfilms);
  };

  return (
    <li className="listItem" key={character.url} onClick={handleTogglefilms}>
      {character.name}
      {showfilms && (
        <ul className="filmList">
          {films.map((film, index) => (
            <ul key={index}>
              <p className="filmTitle">{film.title}</p>
              <p>{film.release_date}</p>
              <p>{film.opening_crawl?.slice(0, 130)}</p>
            </ul>
          ))}
        </ul>
      )}
    </li>
  );
};

export default CharacterList;

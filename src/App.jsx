import React, { useEffect, useState } from 'react'
import Search from './components/Search'
import Spinner from './components/Spinner';
import MovieCard from './components/MovieCard';

function App() {

  const [searchTerm, setSearchTerm] = useState("");

  const API_BASE_URL = 'https://api.themoviedb.org/3';

  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

  const API_OPTIONS = {
    method: "GET",
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`
    }
  }
  const [errorMesg, setErrorMsg] = useState("");
  const [moviesList, setMoviesList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);



  const fetchMovies = async (searchQuery = '') => {

    setIsLoading(true);
    setErrorMsg("");
    try {

      const endpoint = searchQuery ? `${API_BASE_URL}/search/movie?query=${searchQuery}` : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      // alert(response);

      if (!response) {

        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();
      // console.log(data);

      if (data.response === 'False') {
        setErrorMsg(data.error || "Failed to fetch movies");
        setMoviesList([]);
        return;
      }

      setMoviesList(data.results || []);

    } catch (error) {

      console.error(`ERROR FEtching Movies: ${error}`);
      setErrorMsg("ERROR Fetching moveis, Please Try again!");

    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {

    // https://api.themoviedb.org/3/person/{person_id}/movie_credits

    fetchMovies(searchTerm);

  }, [searchTerm]);


  return (
    <main>
      <div className='pattern'>

        <div className="wrapper">

          <header>
            <img src="./hero.png" alt="Hero Banner" />
            <h1>Find <span className='text-gradient'>Movies</span> You'll Enjoy without the Hassel</h1>

            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          </header>


          <section className='all-movies'>
            <h2 className='mt-40px'>All Movies</h2>

            {/* {errorMesg && <p className='text-red-500'>{errorMesg}</p>} */}

            {isLoading ? (
              // <p className='text-white'>Loading ... </p>
              <Spinner />
            ) : errorMesg ? (
              <p className='text-red-500'>{errorMesg}</p>
            ) : (

              <ul>
                {moviesList.map((movie) => {
                  return <MovieCard key={movie.id} movie={movie} />

                  // <p  key={movie.id} className='text-white'>
                  //   {movie.title}
                  // </p>
                })}
              </ul>
            )

            }
          </section>

        </div>

      </div>

    </main>
  )
}

export default App

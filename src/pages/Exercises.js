import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  InputGroup,
  FormControl,
  Button,
  Card,
  Row,
} from "react-bootstrap";
import { fetchData } from "../utils/fetchData";
import { FaSearch } from "react-icons/fa";
import ErrorMessage from "../components/ErrorMessage";

function Exercises() {
  const [searchInput, setSearchInput] = useState("");
  const [allExercises, setAllExercises] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [noResultsFound, setNoResultsFound] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadExercises() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const exercisesData = await fetchData(
          "https://exercisedb.p.rapidapi.com/exercises?limit=2000"
        );

        console.log("FULL API RESPONSE:", exercisesData);
        console.log("TOTAL EXERCISES LOADED:", exercisesData?.length);

        const safeExercises = Array.isArray(exercisesData) ? exercisesData : [];
        setAllExercises(safeExercises);
      } catch (error) {
        console.error("Exercise load error:", error);
        setErrorMessage("Unable to load exercises right now. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }

    loadExercises();
  }, []);

  function handleSearch() {
    const trimmedSearch = searchInput.trim().toLowerCase();

    if (!trimmedSearch) {
      setExercises([]);
      setNoResultsFound(false);
      return;
    }

    const searchWords = trimmedSearch.split(" ").filter(Boolean);

    const searchedExercises = allExercises.filter((item) => {
      const exerciseName = item.name?.toLowerCase() || "";

      return searchWords.some((word) => exerciseName.includes(word));
    });

    setExercises(searchedExercises);
    setNoResultsFound(searchedExercises.length === 0);
  }

  return (
    <Container className="margin-bottom-custom">
      <h1 className="brand-font">Exercises</h1>

      <InputGroup className="input-group my-3" size="sm">
        <FormControl
          className="form"
          placeholder="Search for an exercise (ex: bench, deadlift, curl)"
          type="text"
          value={searchInput}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSearch();
            }
          }}
          onChange={(event) => setSearchInput(event.target.value)}
        />
        <Button
          className="search-button"
          onClick={handleSearch}
          disabled={isLoading}
        >
          <FaSearch className="search-icon" />
        </Button>
      </InputGroup>

      {isLoading && <p>Loading exercises...</p>}

      {(noResultsFound || errorMessage) && !isLoading && (
        <ErrorMessage
          Message={errorMessage || "No results found, please try again."}
        />
      )}

      {exercises.length > 0 && (
        <div>
          <p>Here are the results for "{searchInput}"...</p>

          <Row>
            {exercises.map((exercise) => (
              <div
                className="card-container col-12 col-md-6 col-lg-4 col-xl-3 col-xxl-2"
                key={exercise.id}
              >
                <Card className="card-style h-100">
                  <Card.Body className="card-body">
                    <Card.Title className="card-title mb-3">
                      {exercise.name}
                    </Card.Title>

                    <Card.Text className="card-text mb-2">
                      <strong>ID:</strong> {exercise.id}
                    </Card.Text>

                    <Card.Text className="card-text mb-2">
                      <strong>Body Part:</strong> {exercise.bodyPart}
                    </Card.Text>

                    <Card.Text className="card-text mb-2">
                      <strong>Target Muscle:</strong> {exercise.target}
                    </Card.Text>

                    <Card.Text className="card-text mb-0">
                      <strong>Equipment:</strong> {exercise.equipment}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </Row>
        </div>
      )}
    </Container>
  );
}

export default Exercises;

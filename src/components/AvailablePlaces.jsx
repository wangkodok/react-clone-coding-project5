import { useState, useEffect } from "react";
import Places from "./Places.jsx";
import Error from "./Error.jsx";
import { sortPlacesByDistance } from "../loc.js";

export default function AvailablePlaces({ onSelectPlace }) {
  const [loading, setLoading] = useState(false);
  const [availablePlaces, setAvailablePlaces] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    async function fetchPlaces() {
      setLoading(true);

      try {
        const response = await fetch("http://localhost:3000/places");
        const resData = await response.json();

        if (!response.ok) {
          throw new Error("오류");
        }

        navigator.geolocation.getCurrentPosition((position) => {
          console.log(position);
          const sortedPlaces = sortPlacesByDistance(
            resData.places,
            position.coords.latitude,
            position.coords.longitude
          );
          setAvailablePlaces(sortedPlaces);
          setLoading(false);
        });
      } catch (error) {
        setError({
          message:
            error.message || "장소를 불러오지 못했습니다. 다시 시도해주세요.",
        });
        setLoading(false);
      }
    }

    fetchPlaces();
  }, []);

  if (error) {
    return <Error title="오류가 발생했습니다." message={error.message} />;
  }

  return (
    <Places
      title="Available Places"
      places={availablePlaces}
      isLoading={loading}
      loadingText="데이터를 불러오는 중입니다."
      fallbackText="No places available."
      onSelectPlace={onSelectPlace}
    />
  );
}

import axios from "axios";

const form = document.querySelector("form") as HTMLFormElement;
const addressInput = document.getElementById("address") as HTMLInputElement;
const mapElement = document.getElementById("map") as HTMLDivElement;

const GOOGLE_MAPS_API_KEY = "AIzaSyBFAkY-39D4MaOA2xbr5JqMmYSJoCpX1tk";

type GoogleGeocodingResponse = {
  results: { geometry: { location: { lat: number; lng: number } } }[];
  status: "OK" | "ZERO_RESULTS";
};

function searchAddressHandler(event: Event) {
  event.preventDefault();
  const enteredAddress = addressInput.value;

  axios
    .get<GoogleGeocodingResponse>(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURI(
        enteredAddress
      )}&key=${GOOGLE_MAPS_API_KEY}`
    )
    .then(async (response) => {
      if (response.data.status !== "OK") throw new Error("Couldn't fetch a location!");
      const coords = response.data.results[0].geometry.location;
      const {Map} = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
      const map = new Map(mapElement, {
        center: coords,
        zoom: 8,
      });
      new google.maps.Marker({
        position: coords,
        map
      })
    })
    .catch((err: Error) => {
      alert(err.message);
      console.log(err);
    });
}

form.addEventListener("submit", searchAddressHandler);

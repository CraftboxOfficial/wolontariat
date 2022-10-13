import {createSignal, onMount, For, Show} from 'solid-js'
import { Loader } from '@googlemaps/js-api-loader';

const loader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  version: "weekly",
  libraries: ["places"]
});

const mapOptions = {
  center: {
    lat: 0,
    lng: 0
  },
  zoom: 4
};

let map;

const GoogleMap = () => { 
  onMount(async () => {
    loader
      .load()
      .then((google) => {
        new google.maps.Map(document.getElementById("map"), mapOptions);
        console.log(google)
      })
      .catch(e => {
        console.error(e)
        // do something
      });
  });
  return (
    <div id="map" />
  );
}
 
export default GoogleMap;
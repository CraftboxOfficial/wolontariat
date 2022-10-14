import {createSignal, onMount, For, Show} from 'solid-js'
import { Loader } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from "@googlemaps/markerclusterer";

const loader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  version: "weekly",
  libraries: ["places"]
});

const mapOptions = {
  center: {
    lat: 51.9194381,
    lng: 19.145136
  },
  streetViewControl: false,
  mapTypeId: google.maps.MapTypeId.ROADMAP,
  disableDefaultUI: false,
  mapTypeControl: false,
  scaleControl: true,
  zoomControl: true,
  zoomControlOptions: {
    style: google.maps.ZoomControlStyle.LARGE 
  },
  zoom: 6
};

const locations = [
  { lat: 51.919438, lng: 19.145136 },
  { lat: 47.919438, lng: 18.145136 },
  { lat: 51.919438, lng: 18.175136 },
  { lat: 51.929438, lng: 19.135136 },
  { lat: 51.969438, lng: 19.345136 },
  { lat: 56.819438, lng: 19.145136 },
  { lat: 51.919838, lng: 19.148136 },
  { lat: 54.909438, lng: 19.145136 },
  { lat: 56.919438, lng: 19.945136 },
  { lat: 51.979438, lng: 19.145136 },
  { lat: 52.919438, lng: 19.145166 },
  { lat: 51.519438, lng: 19.145136 },
  { lat: 51.919438, lng: 19.435136 },
  { lat: 50.219438, lng: 19.145136 },
  { lat: 51.919438, lng: 19.245136 },

];

let map;

const GoogleMap = () => { 
  onMount(async () => {
    loader
      .load()
      .then((google) => {
        const map = new google.maps.Map(document.getElementById("map"), mapOptions);
        console.log(google)

        const infoWindow = new google.maps.InfoWindow({
          content: "",
          disableAutoPan: true,
        });
  
        const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const markers = locations.map((position, i) => {
          const label = labels[i % labels.length];
          const marker = new google.maps.Marker({
            position,
            label,
          });
      
          marker.addListener("click", () => {
            infoWindow.setContent('Post od ' + label);
            infoWindow.open(map, marker);
          });
          return marker;
        });
      
        new MarkerClusterer({ markers, map });
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
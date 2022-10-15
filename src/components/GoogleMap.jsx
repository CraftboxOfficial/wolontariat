import {createSignal, onMount, For, Show, useContext, createEffect} from 'solid-js'
import { Loader } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { markerClustersContext } from '../App';

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
  //mapTypeId: google.maps.MapTypeId.ROADMAP,
  disableDefaultUI: false,
  mapTypeControl: false,
  scaleControl: true,
  zoomControl: true,
  zoomControlOptions: {
    //style: google.maps.ZoomControlStyle.LARGE 
  },
  zoom: 6
};

let map;

const addMarker = (position, label) => {
  const marker = new google.maps.Marker({
    position,
    label,
    map
  });

  const infoWindow = new google.maps.InfoWindow({
    content: "",
    disableAutoPan: true,
  });

      
  marker.addListener("click", () => {
    infoWindow.setContent('Post od ' + label);
    infoWindow.open(map, marker);
  });
  return marker
}

const GoogleMap = ({locations}) => { 
  createEffect(() => {
    console.warn(locations());
  })

  onMount(async () => {
    loader
      .load()
      .then((google) => {
        document.getElementById('map').classList.add('showed') // loading placeholder
        map = new google.maps.Map(document.getElementById("map"), mapOptions);
        console.log(google)

        const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const data = locations().data;
        const markers = data.map((item, i) => {
          const position = item.geolocation;
          const label = labels[i % labels.length];
          const marker = addMarker(position, label);
          return marker;
        });
      
        new MarkerClusterer({ markers, map });
      })
      .catch(e => {
        console.error(e)
      });
  });
  return (
    <>
        <div id="map" />
    </>
  );
}
 
export default GoogleMap;
import {createSignal, onMount, For, Show, useContext, createEffect, runWithOwner, getOwner } from 'solid-js'
import { Loader} from '@googlemaps/js-api-loader';
import { MarkerClusterer} from "@googlemaps/markerclusterer"
import {LocationsProvider, useLocations} from '../LocationsProvider';
import { getPosts } from '../App';

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
let markerClusters;

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

const GoogleMap = () => { 
  const [locations, {updateLocations}] = useLocations();

  const loadMarkers = (refreshMap) => {
    loader
    .load()
    .then((google) => {
      if(refreshMap){
        map = new google.maps.Map(document.getElementById("map"), mapOptions);
        document.getElementById('map').classList.add('showed') 
      }
      console.log(google)
      const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const data = locations().data;
      const markers = data.map((item, i) => {
        const position = item.geolocation;
        const label = labels[i % labels.length];
        const marker = addMarker(position, label);
        return marker;
      });
    
      markerClusters = new MarkerClusterer({ markers, map });
    })
    .catch(e => {
      console.error(e)
    });
  }

  createEffect(() => {
    if(locations().length !== 0){
      if(markerClusters !== undefined){
        markerClusters.clearMarkers();
      }

      loadMarkers(false)
      if(locations().data.length !== 0){
        loadMarkers(false)
      }
    }
  });

  onMount(async () => {
    console.log(locations, "  :LOCATIONS")
    const posts = await getPosts();
    updateLocations(posts);

    loadMarkers(true);
  });
  return (
    <>
      <button onClick={() => {console.log(locations())}}>tt</button>
      <div id="map" />
      {locations && <h1>locations data: {JSON.stringify(locations())}</h1>}
    </>
    
  );
}

export default GoogleMap;
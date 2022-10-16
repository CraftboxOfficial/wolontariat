import { createSignal, onMount, For, Show, useContext, createEffect, runWithOwner, getOwner } from 'solid-js'
import { Loader } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from "@googlemaps/markerclusterer"
import { LocationsProvider, useLocations } from '../LocationsProvider';
import { getPosts } from '../App';
import { styled } from 'solid-styled-components';

const loader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  version: "weekly",
  libraries: [ "places" ]
});

const mapOptions: google.maps.MapOptions = {
  center: {
    lat: 51.9194381,
    lng: 19.145136
  },
  streetViewControl: false,
  //mapTypeId: google.maps.MapTypeId.ROADMAP,
  disableDefaultUI: false,
  mapTypeControl: false,
  scaleControl: false,
  zoomControl: false,
  zoomControlOptions: {
    //style: google.maps.ZoomControlStyle.LARGE 
  },
  zoom: 6,
  
};

let map: any;
let markerClusters: any;

const addMarker = (position: any, label: any) => {
  const markerOptions: google.maps.MarkerOptions = {
    position,
    label,
    map
  }
  const marker = new google.maps.Marker(markerOptions);

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

export const GoogleMap = () => {
  //@ts-ignore
  const [ locations, { updateLocations } ] = useLocations();

  const loadMarkers = (refreshMap: any) => {
    loader
      .load()
      .then((google) => {
        if (refreshMap) {
          map = new google.maps.Map(document.getElementById("map") as HTMLElement, mapOptions);
          document.getElementById('map')?.classList.add('showed')
        }
        console.log(google)
        const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const data = locations().data;
        const markers = data.map((item: any, i: number) => {
          const position = item.geolocation;
          const label = labels[ i % labels.length ];
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
    if (locations().length !== 0) {
      if (markerClusters !== undefined) {
        markerClusters.clearMarkers();
      }

      if (locations().data.length !== 0) {
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
      {/* <button onClick={() => {console.log(locations())}}>tt</button> */}
      <MapStyle>
        <div id="map" />
      </MapStyle>
      {/* {locations && <h1>locations data: {JSON.stringify(locations())}</h1>} */}
    </>

  );
}

const MapStyle = styled("div")(() => {
  return {
    "#map": {
      width: "100%",
      // height: "100%"
    }
  }
})
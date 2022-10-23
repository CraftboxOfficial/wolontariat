import { createSignal, onMount, For, Show, useContext, createEffect, runWithOwner, getOwner } from 'solid-js'
import { Loader } from '@googlemaps/js-api-loader';
import { MarkerClusterer } from "@googlemaps/markerclusterer"
import { LocationsProvider, useLocations } from '../LocationsProvider';
import { getPosts } from '../App';
import { styled } from 'solid-styled-components';
import { useNavigate } from 'solid-app-router';
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
  disableDefaultUI: true,
  mapTypeControl: false,
  scaleControl: false,
  zoomControl: false,
  zoomControlOptions: {
    //style: google.maps.ZoomControlStyle.LARGE 
  },
  zoom: 7,

};

let map: any;
let markerClusters: any;
let autocomplete: any;

export const GoogleMap = () => {

  const navigate = useNavigate()
  //@ts-ignore
  const [ locations, { updateLocations } ] = useLocations();
  const [ mapLoading, setMapLoading ] = createSignal(false);

  const markerHandleClick = (id: Number) => {
    const Item = locations().data.filter((i: any) => { return i.id === id })[ 0 ];
    //map.setCenter({'lat': 10, "lng": 10})
    navigate(`/post/${Item.id}`)
    console.log(Item)
  }

  const addMarker = (position: any, id: number, title: string) => {
    const markerOptions: google.maps.MarkerOptions = {
      position,
      map,
      optimized: true,
      title: title,
      label: {
        className: "map-marker",
        text: title,
        fontSize: "180%",
        color: "#FFFFFF"
      }
    }
    const marker = new google.maps.Marker(markerOptions);

    marker.addListener("click", () => { markerHandleClick(id) });

    return marker
  }


  const loadMarkers = async (refreshMap: any) => {
    setMapLoading(true);

    loader
      .load()
      .then((google) => {
        if (refreshMap) {
          map = new google.maps.Map(document.getElementById("map") as HTMLElement, mapOptions);
          autocomplete = new google.maps.places.Autocomplete(document.getElementById("autocomplete") as HTMLInputElement)
          document.getElementById('map')?.classList.add('showed')
        }
        console.log(google)

        const data = locations().data;
        const markers = data.map((item: any, i: number) => {
          const position = item.geolocation;
          const marker = addMarker(position, item.id, item.title);
          return marker;
        });

        markerClusters = new MarkerClusterer({ markers, map });
        setMapLoading(false);
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
        loadMarkers(false);
      }
    }
  });

  onMount(async () => {
    const posts = await getPosts();
    updateLocations(posts);
    setMapLoading(true);
    if (navigator.geolocation) {
      await navigator.geolocation.getCurrentPosition((position) => {
        //@ts-ignore
        mapOptions.center.lat = position.coords.latitude;
        //@ts-ignore
        mapOptions.center.lng = position.coords.longitude;
        //@ts-ignore
        mapOptions.zoom = 10;
        loadMarkers(true);
        setMapLoading(false);
      }, (error) => {
        mapOptions.zoom = 7;
        loadMarkers(true);
      });
    } else {
      loadMarkers(true);
    }
  });
  return (
    <>
      <input id="autocomplete"></input>
      {/* <button onClick={() => {console.log(locations())}}>tt</button> */}
      <MapStyle>
        <Show when={mapLoading()}><h1>loading map...</h1></Show>
        <div id="map" />
      </MapStyle>
      {/* {locations && <h1>locations data: {JSON.stringify(locations())}</h1>} */}
    </>

  );
}

const MapStyle = styled("div")(() => {
  return {
    "#autocomplete": {
      position: 'fixed',
      zIndex: 100
    },
    "#map": {
      width: "100%",
      // height: "100%"
    }
  }
})
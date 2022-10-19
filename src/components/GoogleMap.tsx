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

export const GoogleMap = () => {
  //@ts-ignore
  const [ locations, { updateLocations } ] = useLocations();
  const [mapLoading, setMapLoading] = createSignal(false);

  const markerHandleClick = (id:Number) => {
    const Item = locations().data.filter((i:any) => {return i.id === id})[0];
    console.log(Item)
  }

  const addMarker = (position: any, label: any, id:any) => {
    const markerOptions: google.maps.MarkerOptions = {
      position,
      label,
      map,
      optimized: true,
      title: id.toString()
    }
    const marker = new google.maps.Marker(markerOptions);
  
    marker.addListener("click", () => {markerHandleClick(id)});
  
    return marker
  }


  const loadMarkers = async (refreshMap: any) => {
    setMapLoading(true);
    //zbugowane
    
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
          const marker = addMarker(position, label, item.id);
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
    if(navigator.geolocation){
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
    }else{
      loadMarkers(true);
    }
  });
  return (
    <>
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
    "#map": {
      width: "100%",
      // height: "100%"
    }
  }
})
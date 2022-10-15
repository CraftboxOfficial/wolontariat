import {createSignal, onMount, For, Show} from 'solid-js'
import {Map, View, Feature} from 'ol';
import VectorSource from 'ol/source/Vector';
import LayerVector from 'ol/layer/vector';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {useGeographic} from 'ol/proj';
import {fromLonLat} from 'ol/proj';
import Point from 'ol/geom/Point';
import Style from 'ol/style/Style';
import Icon from 'ol/style/Icon';
import Modify from 'ol/interaction/Modify';
import Select from 'ol/interaction/Select';

const handleMarkerClick = (e) => {
  console.log(e)
}

const handleMapClick = (e) => {
  //console.log(e)
}

const locations = [
  {'lon': 19.145136, 'lat': 51.919438},
  {'lon': 19.126136, 'lat': 51.979438},
  {'lon': 29.145136, 'lat': 51.919438},
  {'lon': 49.145136, 'lat': 51.919438},
  {'lon': 29.145136, 'lat': 51.919438},
  {'lon': 19.145136, 'lat': 51.919438},
  {'lon': 19.165136, 'lat': 51.929438},
  {'lon': 16.745136, 'lat': 54.919438},
]

const OpenLayersMap = () => { 
  onMount(async () => {
    const map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: fromLonLat([19.145136,51.919438]),
        zoom: 6
      }),
    });

    const markers = new LayerVector({
      source: new VectorSource(),
      style: new Style({
        image: new Icon({
          anchor: [0.5, 1],
          src: 'marker.png',
          scale: 0.03, 
        })
      })
    })
    map.addLayer(markers);

    locations.map(loc => {
      var marker = new Feature(new Point(fromLonLat([loc.lon,loc.lat])));
      markers.getSource().addFeature(marker);
    })

    map.on('singleclick', (evt) => {
      var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature, layer) {
        return feature;
      });

      if (feature) {
        console.log(feature);
      }
    })
  });
  
  return (
    <div id="map" />
  );
}
 
export default OpenLayersMap;
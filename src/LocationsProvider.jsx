import { createContext, useContext, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
const LocationContext = createContext();
export const LocationsProvider = (props) => {
  const [state, setState] = createSignal(props.locations);
  const updateLocations = (locations) => setState(locations)
  return (
    <LocationContext.Provider value={[state, {updateLocations}]}>
      {props.children}
    </LocationContext.Provider>
  )
}

export const useLocations = () => useContext(LocationContext);
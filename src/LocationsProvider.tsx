import { createContext, useContext, createSignal, Component, JSXElement } from "solid-js";
import { createStore } from "solid-js/store";

const LocationContext = createContext();
export const LocationsProvider: Component<{ children: JSXElement, locations: any }> = (props) => {

  const [ state, setState ] = createSignal(props.locations);

  const updateLocations = (locations: any) => setState(locations)

  return (
    <LocationContext.Provider value={[ state, { updateLocations } ]}>
      {props.children}
    </LocationContext.Provider>
  )
}

export const useLocations = () => useContext(LocationContext);
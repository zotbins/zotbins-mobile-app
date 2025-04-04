import React, { createContext, useContext, useEffect, useState } from "react";
import mapboxSdk from "@mapbox/mapbox-sdk";
import mapboxDirections from "@mapbox/mapbox-sdk/services/directions";
import Mapbox from '@rnmapbox/maps'

const MapboxContext = createContext();

export const useMapboxContext = () => useContext(MapboxContext);

export const MapboxProvider = ({ children }) => {
    const [mapboxClient] = useState(() =>
        mapboxSdk({ accessToken: process.env.EXPO_PUBLIC_MAPBOXACCESSTOKEN })
    );
    const [directionsClient] = useState(() =>
        mapboxDirections(mapboxClient)
    );

    useEffect(() => {
        // Mapbox Configuration
        Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOXACCESSTOKEN);
        Mapbox.setTelemetryEnabled(false);
    }, []);
    
    return (
        <MapboxContext.Provider value={{ mapboxClient, directionsClient }}>
        {children}
        </MapboxContext.Provider>
    );
    }
export default MapboxProvider;
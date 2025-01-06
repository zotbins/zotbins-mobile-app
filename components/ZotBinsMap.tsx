import BinStatusModal from "@/components/BinStatusModal";
import Mapbox, {
  Camera,
  LineLayer,
  LocationPuck,
  MapView,
  PointAnnotation,
  ShapeSource,
} from "@rnmapbox/maps";
import React, { useRef, useState } from "react";
import { Image, View } from "react-native";
import ZotBinsLogo from "../assets/images/zotbins_logo.png";
import { markers } from "../assets/markers.js";

import mapboxSdk from '@mapbox/mapbox-sdk';
import mapboxDirections from '@mapbox/mapbox-sdk/services/directions';

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOXACCESSTOKEN as string);
Mapbox.setTelemetryEnabled(false);

const directionsClient = mapboxDirections(mapboxSdk({ accessToken: process.env.EXPO_PUBLIC_MAPBOXACCESSTOKEN as string }));


const ZotBinsMap = () => {
  const [displayModal, setDisplayModal] = useState(false);
  const [activeBinName, setActiveBinName] = useState("");
  const [activeBinCoordinates, setActiveBinCoordinates] = useState<number[]>([]);
  const [route, setRoute] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<number[]>([]);
  
  // make type more specific instead of "any"
  const markerRefs: { [key: string]: any } = useRef({});

  const closeModal = () => {
    setDisplayModal(false);
    setActiveBinName("");
  };

  const getDirections = async (start: number[], end: number[]) => {
    try {
      const response = await directionsClient.getDirections({
          profile: 'walking',
          waypoints: [
              { coordinates: [start[0], start[1]] },
              { coordinates: [end[0], end[1]] }
          ],
          geometries: 'geojson'
        }).send();

        if (response && response.body && response.body.routes.length) {
          setRoute(response.body.routes[0].geometry);
        }
    } 
    catch (error) {
      console.error(error);
    }
  }

  const activateRouting = () => {
    // start is set to first bin for now, needs to be changed to user location
    const start = [markers[0].longitude, markers[0].latitude];
    const end = activeBinCoordinates;
    getDirections(start, end);
  }
    

  return (
    <View className="w-full h-full">
      <MapView
        styleURL="mapbox://styles/mapbox/streets-v12"
        style={{ flex: 1 }}
        zoomEnabled={true}
        rotateEnabled={true}
        scaleBarEnabled={false}
      >
        <Camera
          zoomLevel={14}
          centerCoordinate={[-117.84272383250185, 33.646044797114584]}
          pitch={0}
          animationMode={"flyTo"}
          animationDuration={500}
        />

        <LocationPuck
          puckBearingEnabled
          puckBearing="heading"
          pulsing={{ isEnabled: true }}
        />

        {/* <ShapeSource id="zotbins" shape={} */}

        {markers.map((marker) => (
          <PointAnnotation
            ref={(ref) => (markerRefs.current[marker.name] = ref)}
            key={marker.name}
            id={marker.name}
            coordinate={[marker.longitude, marker.latitude]}
            onSelected={() => {
              setDisplayModal(true);
              setActiveBinName(marker.name);
              setActiveBinCoordinates([marker.longitude, marker.latitude]);
            }}
          >
            <Image
              source={ZotBinsLogo}
              resizeMode="contain"
              className={`h-12 w-12`}
              onLoad={() => markerRefs.current[marker.name]?.refresh()}
            />
          </PointAnnotation>
        ))}

        {route && (
          <ShapeSource id="routeSource" shape={route}>
            <LineLayer
              id="routeFill"
              style={{
                lineColor: "#66aec4",
                lineWidth: 3,
                lineCap: "round",
                lineJoin: "round",
              }}
            />
          </ShapeSource>
        )}
      </MapView>
      {displayModal && (
        <View className="justify-center items-center">
          <BinStatusModal 
            name={activeBinName} 
            closeModal={closeModal}
            activateRouting={activateRouting}
            />
        </View>
      )}
    </View>
  );
};

export default ZotBinsMap;

import BinStatusModal from "@/components/Map/BinStatusModal";
import Mapbox, {
  Camera,
  LineLayer,
  LocationPuck,
  MapView,
  PointAnnotation,
  ShapeSource,
} from "@rnmapbox/maps";

import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  BottomSheetModal,
  BottomSheetView,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';

import React, { useEffect, useRef, useState } from "react";
import { Image, View, ActivityIndicator, Text } from "react-native";
import ZotBinsLogo from "../../assets/images/zotbins_logo.png";
import { markers } from "../../assets/markers.js"; // bins @ sci lib, langson lib, student center:

import mapboxSdk from "@mapbox/mapbox-sdk";
import mapboxDirections from "@mapbox/mapbox-sdk/services/directions";

import * as Location from "expo-location";
import BinStatusBottomSheet from "./BinStatusBottomSheet";

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOXACCESSTOKEN as string);
Mapbox.setTelemetryEnabled(false);

const directionsClient = mapboxDirections(
  mapboxSdk({
    accessToken: process.env.EXPO_PUBLIC_MAPBOXACCESSTOKEN as string,
  })
);

type Marker = {
  name: string;
  longitude: number;
  latitude: number;
};

const ZotBinsMap = () => {
  const [displayModal, setDisplayModal] = useState(false);
  const [activeBinName, setActiveBinName] = useState("");
  const [activeBinCoordinates, setActiveBinCoordinates] = useState<number[]>(
    []
  );
  const [route, setRoute] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userLocation, setUserLocation] = useState<number[]>([]);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      // get the users location
      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setUserLocation([coords.longitude, coords.latitude]);

      // find nearest bin
      const userCoords: [number, number] = [coords.longitude, coords.latitude];
      const nearestBin = findNearestBin(userCoords, markers);

      // set the active ben
      setActiveBinName(nearestBin.name);
      setActiveBinCoordinates([nearestBin.longitude, nearestBin.latitude]);

      // get directions to nearest bin
      await getDirections(userCoords, [
        nearestBin.longitude,
        nearestBin.latitude,
      ]);
      setIsLoading(false);
    })();
  }, []);

  // make type more specific instead of "any"
  const markerRefs: { [key: string]: any } = useRef({});


  const openModal = () => {

    setDisplayModal(true);
    bottomSheetModalRef.current?.present();
  };

  const closeModal = () => {
    bottomSheetModalRef.current?.dismiss();
    setDisplayModal(false);
    setActiveBinName("");
    setActiveBinCoordinates([]);
  };

  // function to calculate two distances, uses Haversine formula
  // calculates straight distance, not Euclidean
  const getDistance = (coord1: [number, number], coord2: [number, number]) => {
    const toRad = (x: number) => (x * Math.PI) / 180;

    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;

    const earthRad = 6371e3; // earth radius in meters
    const lat1Rad = toRad(lat1);
    const lat2Rad = toRad(lat2);
    const latDiffRad = toRad(lat2 - lat1);
    const longDiffRad = toRad(lon2 - lon1);

    const a =
      Math.sin(latDiffRad / 2) * Math.sin(latDiffRad / 2) +
      Math.cos(lat1Rad) *
        Math.cos(lat2Rad) *
        Math.sin(longDiffRad / 2) *
        Math.sin(longDiffRad / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = earthRad * c; // distance in meters
    return distance;
  };

  /* Find nearest bin from user's location
      - set an initial bin to be the nearest bin
      - calculate the distance to that bin (from user location)
      - then calculate all distances from remaining bin 

      datatype of output is a marker --> markers.js
  */
  const findNearestBin = (userCoords: [number, number], bins: Marker[]) => {
    let nearest = bins[0];
    let minDistance = getDistance(userCoords, [
      bins[0].longitude,
      bins[0].latitude,
    ]);

    for (let i = 1; i < bins.length; i++) {
      let distance = getDistance(userCoords, [
        bins[i].longitude,
        bins[i].latitude,
      ]);
      if (distance < minDistance) {
        nearest = bins[i];
        minDistance = distance;
      }
    }

    return nearest;
  };

  const getDirections = async (start: number[], end: number[]) => {
    try {
      const response = await directionsClient
        .getDirections({
          profile: "walking",
          waypoints: [
            { coordinates: [start[0], start[1]] },
            { coordinates: [end[0], end[1]] },
          ],
          geometries: "geojson",
        })
        .send();

      if (response && response.body && response.body.routes.length) {
        setRoute(response.body.routes[0].geometry);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const activateRouting = () => {
    // start is set to first bin for now, needs to be changed to user location
    // const start = [markers[0].longitude, markers[0].latitude];
    if (!userLocation || userLocation.length !== 2) {
      return;
    }
    const start = userLocation;
    const end = activeBinCoordinates;
    getDirections(start, end);
  };

  // show a loading indicator while fetching location and directions
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center ">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="w-full h-full">
      <GestureHandlerRootView>
          <BottomSheetModalProvider>
            <BinStatusBottomSheet
              bottomSheetRef={bottomSheetModalRef}
              onClose={closeModal}
              name={activeBinName}
              activateRouting={activateRouting}
            />
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
                    openModal();
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
           
        </BottomSheetModalProvider>
      </GestureHandlerRootView>
    </View>
  );
};

export default ZotBinsMap;

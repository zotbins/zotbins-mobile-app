
interface Marker {
  name: string;
  longitude: number;
  latitude: number;
}

// bindata interface to store active bin attributes
interface BinData {
  name: string;
  capacity: number;
  distance: number | null;
  coordinates: [number, number];
  eta?: number;
  routeData: any | null;
}

const WALKING_SPEED_MPS = 1.4; // meters per second
const EARTH_RADIUS_METERS = 6371e3;
const DEFAULT_ZOOM_LEVEL = 14;
const DEFAULT_CENTER: [number, number] = [-117.84272383250185, 33.646044797114584];

import Mapbox, {
  Camera,
  LineLayer,
  LocationPuck,
  MapView,
  PointAnnotation,
  ShapeSource,
  UserLocation,
} from "@rnmapbox/maps";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import React, { useEffect, useRef, useState } from "react";
import { Image, View, ActivityIndicator, Pressable, Text, Alert } from "react-native";
import ZotBinsLogo from "../../assets/images/zotbins_logo.png";
import { markers } from "../../assets/markers.js";

import * as Location from "expo-location";
import BinStatusBottomSheet from "./BinStatusBottomSheet";
import { router } from "expo-router";
import { useMapboxContext} from "../../context/MapboxProvider";


const ZotBinsMap = () => {
  // get mapbox directions client from context
  const { directionsClient } = useMapboxContext();
  // flag to check if bottom sheet is open
  const [displayModal, setDisplayModal] = useState(false);
  // state to store active bin data
  const [activeBin, setActiveBin] = useState<BinData | null>(null);
  // state to store active route data
  const [activeRoute, setActiveRoute] = useState<any>(null);
  // state to store user location
  const [userLocation, setUserLocation] = useState<number[]>([]);

  // ref to bottom sheet modal to control open/close
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const markerRefs = useRef<{ [key: string]: any }>({});
  const cameraRef = useRef<Mapbox.Camera | null>(null);

  // utility functions
  const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

  // get straight distance between two coordinates
  const getDistance = (coord1: [number, number], coord2: [number, number]): number => {
    const [lon1, lat1] = coord1;
    const [lon2, lat2] = coord2;
    
    const lat1Rad = toRadians(lat1);
    const lat2Rad = toRadians(lat2);
    const latDiffRad = toRadians(lat2 - lat1);
    const longDiffRad = toRadians(lon2 - lon1);

    const a =
      Math.sin(latDiffRad / 2) * Math.sin(latDiffRad / 2) +
      Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(longDiffRad / 2) *
      Math.sin(longDiffRad / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    return EARTH_RADIUS_METERS * c;
  };

  // get nearest bin to user location
  const findNearestBin = (userCoords: [number, number], bins: Marker[]): Marker => {
    return bins.reduce((nearest, current) => {
      const currentDistance = getDistance(userCoords, [current.longitude, current.latitude]);
      const nearestDistance = getDistance(userCoords, [nearest.longitude, nearest.latitude]);
      
      return currentDistance < nearestDistance ? current : nearest;
    }, bins[0]);
  };

  // open nearest bin modal
  const openNearestBin = () => {
    const nearestBin = findNearestBin(userLocation as [number, number], markers);
    openModal(nearestBin);
  };

  // get route data from mapbox directions api
  const getRouteData = async (start: number[], end: number[]) => {
    try {
      // call mapbox directions api
      const response = await directionsClient
        .getDirections({
          profile: "walking",
          waypoints: [
            { coordinates: [start[0], start[1]] },
            { coordinates: [end[0], end[1]] }
          ],
          geometries: "geojson",
        })
        .send();
      // return routed data
      if (response?.body?.routes?.[0]) {
        const route = response.body.routes[0];
        // route.geometry is a GeoJSON LineString
        // route.distance is in meters
        // route.duration is in seconds
        return route;
      }
    } catch (error) {
      console.error('Error fetching directions:', error);
    }
  }

  // get directions from user location to active bin
  const getDirections = async (start: number[], end: number[]) => {
    // use stored route data if available
    if (activeBin?.routeData) {
      console.log("Using stored route")
      setActiveRoute(activeBin.routeData.geometry);
      return;
    }
    // fetch and set route data from mapbox directions api
    const route = await getRouteData(start, end);

    if (route) {
      setActiveRoute(route.geometry);
    }

  }

  // open modal and set active bin
  const openModal = async (marker: Marker) => {
    setDisplayModal(true);
    // get straight distance and ETA to bin in case mapbox directions api fails
    const straightDistanceToBin = userLocation.length === 2
      ? getDistance(userLocation as [number, number], [marker.longitude, marker.latitude])
      : 0;

    const straightETA = straightDistanceToBin / WALKING_SPEED_MPS;

    const routeData = await getRouteData(userLocation, [marker.longitude, marker.latitude]);

    setActiveBin({
      name: marker.name,
      capacity: 0,
      distance: routeData?.distance || straightDistanceToBin,
      coordinates: [marker.longitude, marker.latitude],
      eta: routeData?.duration || straightETA,
      routeData: routeData || null,
    });

    setActiveRoute(null);

    //center map on selected bin
    cameraRef.current?.setCamera({
      centerCoordinate: [marker.longitude, marker.latitude],
      zoomLevel: DEFAULT_ZOOM_LEVEL + 2,
      animationDuration: 500,
    });

    // present bottom sheet modal
    bottomSheetModalRef.current?.present();
  };


  const closeModal = () => {
    // unzoom map and reset camera
    cameraRef.current?.setCamera({
      centerCoordinate: DEFAULT_CENTER,
      zoomLevel: DEFAULT_ZOOM_LEVEL,
      animationDuration: 500,
    });

    // dismiss bottom sheet modal
    bottomSheetModalRef.current?.dismiss();
    setDisplayModal(false);
    setActiveBin(null);
    setActiveRoute(null);
  };
  // activate routing to active bin
  const activateRouting = () => {
    if (!userLocation?.length || !activeBin?.coordinates) return;
    getDirections(userLocation, activeBin.coordinates);
  };

  // get user location on component mount
  useEffect(() => {
    const initializeLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Required", "Please enable location services to use this feature.");
        router.back();
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setUserLocation([coords.longitude, coords.latitude]);

    };
    initializeLocation();
  }, []);

  return (
    <View className="w-full h-full">
      <GestureHandlerRootView>
        <BottomSheetModalProvider>
          {/* Bottom Sheet Modal */}
          <BinStatusBottomSheet
            bottomSheetRef={bottomSheetModalRef}
            onClose={closeModal}
            name={activeBin?.name || ""}
            activateRouting={activateRouting}
            distance={activeBin?.distance || null}
            eta={activeBin?.eta || null}
            activeRoute={activeRoute}
            setActiveRoute={setActiveRoute}
            userLocation={userLocation}
          />
          <MapView
            styleURL="mapbox://styles/mapbox/streets-v12"
            style={{ flex: 1 }}
            zoomEnabled
            rotateEnabled
            scaleBarEnabled={false}
          >
            <Camera
              ref={cameraRef}
              zoomLevel={DEFAULT_ZOOM_LEVEL}
              centerCoordinate={DEFAULT_CENTER}
              pitch={0}
              animationMode="flyTo"
              animationDuration={500}
            />
            <LocationPuck
              puckBearingEnabled
              puckBearing="heading"
              pulsing={{ isEnabled: true }}
            />
            {markers.map((marker) => (
              <PointAnnotation
                ref={(ref) => (markerRefs.current[marker.name] = ref)}
                key={marker.name}
                id={marker.name}
                coordinate={[marker.longitude, marker.latitude]}
                onSelected={() => {
                  // only open modal if user location is available
                  if (userLocation.length === 2) {
                    openModal(marker)
                  }
                }}
              >
                <Image
                  source={ZotBinsLogo}
                  resizeMode="contain"
                  className={marker.name == activeBin?.name ? "w-16 h-16" : "w-12 h-12"}
                  onLoad={() => markerRefs.current[marker.name]?.refresh()}
                />
              </PointAnnotation>
            ))}
            {activeRoute && (
              <ShapeSource id="routeSource" shape={activeRoute}>
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
      {/* Find Nearest Bin Button */}
      { activeBin == null && (
        <View className="absolute bottom-36 left-0 right-0 p-4 z-10 items-center justify-center">
        <Pressable
          onPress={openNearestBin}
          className=" px-4 py-3 z-10 bg-primaryGreen rounded-lg">
          <Text className="text-white text-lg font-semibold">Find Nearest Bin</Text>
        </Pressable>
      </View>
      )}
    </View>
  );
};

export default ZotBinsMap;
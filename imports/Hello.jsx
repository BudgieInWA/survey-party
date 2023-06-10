// import "/imports/lib/leaflet-bing-layer.min";
import React, { useEffect, useState } from 'react';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';
import { Button } from 'react-bootstrap';
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap
} from 'react-leaflet';
import Colors from 'color-hash';

import { PartierCollection } from './partiers';
import geolocation from './geolocation';
import getIcon from './icons';


// const initialLocation = [51.505, -0.09]; // London
const initialLocation = [-31.956, 115.861]; // Perth

export const Hello = ({ userId }) => {
  const isLoading = useSubscribe('partier.list');
  const partiers = useFind(() => PartierCollection.find());

  const updatePosition = () => Meteor.callPromise('partier.setLocation', { _id: userId, location: geolocation() });

  return (
    <div>
      <Button onClick={updatePosition}>Update Pos</Button>
      <MapContainer center={initialLocation} zoom={13} scrollWheelZoom={false} >

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/*<BingLayer unlock="AuhiCJHlGzhg93IqUH_oCpl_-ZUrIE6SPftlyGYUvr9Amx5nzA-WqGcPquyFZl4L" />*/}

        {/*<TileLayer url={new URLSearchParams(location.search)?.get('bg') || ""} />*/}


        {partiers.map(({ icon, name, location: { coordinates } = {}}) =>
          coordinates &&
          <Marker key={name} position={coordinates} icon={getIcon(icon)}>
            <Popup>
              {icon} {name}
            </Popup>
            {/*TODO <div style={{backgroundColor: new Colors().hex(name)}}></div>*/}
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

const BingLayer = ({unlock}) => {
  // TODO
  // useEffect(() => {
  //   const map = useMap();
  //   const layer = map.addLayer(L.tileLayer.bing(unlock));
  //   return () => {
  //     map.removeLayer(layer);
  //   }
  // })
  return null;
}

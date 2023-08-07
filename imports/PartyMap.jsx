// import "/imports/lib/leaflet-bing-layer.min";
import React, { useEffect, useState } from 'react';
import { useSubscribe, useFind } from 'meteor/react-meteor-data';
import { Button } from 'react-bootstrap';
import { LatLng } from 'leaflet';
import { ll, coords } from './lib';
import { MapContainer, Marker, Polygon, Popup, TileLayer, useMap, useMapEvents,  } from 'react-leaflet';
import Colors from 'color-hash';
import { cellToBoundary, cellToLatLng, latLngToCell } from 'h3-js';

import { Spinner } from '/imports/lib/components';

import geolocation from './geolocation';
import getIcon from './icons';
import Marking from './Marking';

import Party from './Party';


// Positions are LatLng except in mongo, where they are `coordinates: [lng, lat]`
// const initialLocation = new LatLng(51.505, -0.09); // London
const initialLocation = new LatLng(-31.956, 115.861); // Perth

export const PartyMap = ({ partyId, members }) => {
  const isLoading = useSubscribe('party.marks', { _id: partyId });
  const marks = useFind(() => Party.marks({ _id: partyId }));

  const updatePosition = () => Meteor.callPromise('me.updateLocation', { coordinates: coords(geolocation()) });
  const addMark = ({ latLng }) => Meteor.callPromise('mark.createPoint', { partyId, coordinates: coords(latLng)});

  return (
    <>
      {isLoading() && <Spinner />}
      <Button onClick={updatePosition}>Update Pos</Button>
      <MapContainer center={initialLocation} zoom={13} scrollWheelZoom={false} >
        <MouseGrid onClick={addMark} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/*<BingLayer unlock="AuhiCJHlGzhg93IqUH_oCpl_-ZUrIE6SPftlyGYUvr9Amx5nzA-WqGcPquyFZl4L" />*/}

        {/*<TileLayer url={new URLSearchParams(location.search)?.get('bg') || ""} />*/}

        {marks.map(({ _id, kind, location }) =>
          // <Marker key={_id} position={coordinates} icon={getIcon(markingIcon(kind))} />
          <Marker key={_id} position={ll(location)} kind={kind} />
        )}

        {members.map(({ _id, icon, username, location, locationAt }) => {
          const pos = ll(location);
          return pos &&
            <Marker key={_id} position={ll(location)} icon={getIcon(icon)}>
              <Popup>
                {icon} {username}
              </Popup>
              {/*TODO <div style={{backgroundColor: new Colors().hex(name)}}></div>*/}
            </Marker>;
          }
        )}
      </MapContainer>
    </>
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


const lod = 12;
const MouseGrid = ({ onClick }) => {
  const [cell, setCell] = useState(null);
  const [bigCell, setBigCell] = useState(null);

  const map = useMapEvents({
    mousemove(ev) {
      const { lat, lng } = ev.latlng;
      setCell(latLngToCell(lat, lng, lod));
      setBigCell(latLngToCell(lat, lng, lod - 1));
    },

    mousedown(ev) {
      const { lat, lng } = ev.latlng;
      onClick?.({ latLng: new LatLng(lat, lng) })
    }
  });

  if (!cell) return null;

  const cellCenter = cellToLatLng(cell);
  const cellBorder = cellToBoundary(cell);
  const bigCellBorder = cellToBoundary(bigCell);

  return <>
    {/*<Marker position={cellCenter} />*/}
    <Polygon positions={cellBorder} pathOptions={{ fill: false }}/>
    <Polygon positions={bigCellBorder} pathOptions={{ stroke: false }} />
  </>;
}

export default PartyMap;

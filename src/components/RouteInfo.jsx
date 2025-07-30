import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  Tooltip,
  useMap,
  useMapEvents,

} from "react-leaflet";
import L from "leaflet";

function RouteInfo({singleRouteData, setViewRouteModalOpen, points, routePath, totalDistance, center}) {
    function ClickHandler({ addPoint }) {
      useMapEvents({
        click(e) {
          addPoint(e.latlng);
        },
      });
      return null;
    }
    const customIcon = L.divIcon({
  className: "custom-div-icon",
  html: `<div style="color: red; font-size: 24px;"><i class="fas fa-map-marker-alt"></i></div>`,
  iconSize: [30, 42],
  iconAnchor: [15, 42],
});



function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center]);
  return null;
}
  return (
    <div>
          <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">View Route</h5>
                <button type="button" className="btn-close" onClick={() => setViewRouteModalOpen(false)}></button>
              </div>
              <div className="modal-body">
                <h3 className="text-center fw-bold">
                  <i className="fa-solid fa-route me-2"></i>Route Details
                </h3>
                <div className="row mt-4">
                  <div className="col-md-3">
                    <p><b>Route Name:</b> {singleRouteData.name}</p>
                  </div>
                  <div className="col-md-3">
                    <p><b>Route Description:</b> {singleRouteData.description}</p>
                  </div>
                  <div className="col-md-3">
                    <p><b>Route Total Distance:</b> {totalDistance || singleRouteData.totalDistance} km</p>
                  </div>
                  <div className="col-md-3">
                    <p><b>Route Creation:</b> {new Date(singleRouteData.createdAt).toLocaleDateString("en-GB")}</p>
                  </div>
                </div>

                <div style={{ height: "400px" }} className="mt-3">
                  <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <ClickHandler addPoint={() => {}} />
                    <MapUpdater center={center} />

                    {routePath.length > 0 && <Polyline positions={routePath} color="blue" />}
                    {points.map((point) => (
                      <Marker key={point.name} position={point.coords} icon={customIcon}>
                        <Tooltip permanent>{point.name}</Tooltip>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setViewRouteModalOpen(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}

export default RouteInfo

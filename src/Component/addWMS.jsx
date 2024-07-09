import React from "react";

const addWMS = (map, sphere) => {
    const wmsLayer = new sphere.Layer('PM2.5', {
        type: sphere.LayerType.WMS,
        url: 'https://service-proxy-765rkyfg3q-as.a.run.app/api_geoserver/geoserver/pm25_hourly_raster_24hr/wms?',
        zoomRange: { min: 1, max: 9 },
        refresh: 180,
        zIndex: 50,
    });

    map.Layers.insert('', wmsLayer);
    console.log('WMS layer inserted.');
};

export default addWMS;

import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import Papa from 'papaparse';
import 'mapbox-gl/dist/mapbox-gl.css';


mapboxgl.accessToken = "pk.eyJ1IjoiaGFubm9oaXNzIiwiYSI6ImNsdWd6NnNtNzBjaGkybHAyMXAwZW95dnYifQ.ugCpnrkxesS79JfAl9fhJw";

const CoiVsSingleFamilyMapComponent = () => {
  const incomeLevels = ["incu10", "inc1015", "inc1520", "inc2025", "inc2530", "inc3035", "inc3540", "inc4045",
    "inc4550", "inc5060", "inc6075", "i7599", "i100125", "i125150", "i150200", "in200o"]
  // These are for labels above the sliders

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/dark-v11',
      zoom: 9.2,
      center: [-71.1295, 42.6533],
      bearing: -72,
      pitch: 68.5,
      transformRequest: (url, resourceType) => {
        if (url.startsWith('http://api.mapbox.com') || url.startsWith('http://tiles.mapbox.com')) {
          return {
            url: url.replace("?", "?pluginName=dataJoins&")
          }
        }
        return { url };
      }
    });

    const csvUrl =
      "https://raw.githubusercontent.com/mfchao/DataVis_FinalProject/main/src/data/sfh_w_coi.csv"
    const csvPromise = papaPromise(csvUrl);

    map.on("load", function () {
      csvPromise.then(function (results) {
        results.data.forEach((row) => {
          var totalPop = 0
          //calculate sum of population for each municipality
          incomeLevels.forEach((level) => {
            totalPop += parseInt(row[level]);
          })

          map.setFeatureState(
            {
              // your source tileset and source layer
              source: "mass-muni",
              sourceLayer: "ma_municipalities_degrees-8uvqwo",
              // unqiue ID row name
              id: row.muni_id,
            },
            //YOUR TURN: Add rows you want to style/interact with
            {
              municipal: row.muni,
              single_family: row.only_single_family * 100,
              // This is the query for "%_single_family", round to 2 decimal places
              percentage_single_family: Math.round(row["%_single_family"] * 100) / 100,
              coi_score: Math.round(row["COI Score"] * 100) / 100
            }
          );
        });
      });

      // YOUR TURN: Add source layer
      map.addSource("mass-muni", {
        type: "vector",
        url: "mapbox://hannohiss.890zal4l",
        promoteId: "muni_id",
      });

      map.addLayer({
        id: "mass-muni-extrusion",
        type: "fill-extrusion",
        source: "mass-muni",
        "source-layer": "ma_municipalities_degrees-8uvqwo",
        maxzoom: 15,
        paint: {
          // Use an 'interpolate' expression to scale the height of the extrusion
          'fill-extrusion-height': [
            'interpolate',
            ['linear'],
            ['feature-state', 'coi_score'],
            1, 0, // Assuming population is 0, height is 0
            9.5, 5000 // Scale up height with population, adjust as needed
          ],
          'fill-extrusion-base': 0, // Base of the extrusions
          'fill-extrusion-opacity': 1, // Adjust the opacity as needed
          // Maintain the color from the existing layer
          'fill-extrusion-color': [
            'interpolate',
            ['linear'],
            ['feature-state', 'percentage_single_family'],
            0, '#6BA0C7', // Start color for 0%
            100, '#CE575E'  // End color for 100%
          ]
        }
      });


      map.addLayer({
        id: "mass-muni-line",
        type: "line",
        source: "mass-muni",
        "source-layer": "ma_municipalities_degrees-8uvqwo",
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#D8CAC1",
          "line-width": .11,
        },
      });

      var popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
      });

      map.on("mousemove", "mass-muni-extrusion", function (e) {
        map.getCanvas().style.cursor = "pointer";

        var muni = map.queryRenderedFeatures(e.point, {
          layers: ["mass-muni-extrusion"],
        });

        var FeatureState = muni[0].state; // Feature state
        var content = "";
        // iterate through the object
        var listedFeatures = [
          "municipal",
          "single_family",
          "percentage_single_family",
          "coi_score"
        ];
        for (var key in FeatureState) {
          if (!FeatureState.hasOwnProperty(key)) {
            continue;
          }
          if (listedFeatures.includes(key))
            content += "<b>" + key + "</b>" + ": " + FeatureState[key] + "<br>";
        }
        popup.setLngLat(e.lngLat).setHTML(content).addTo(map);
      });

      map.on("mouseleave", "muni-fill", function () {
        map.getCanvas().style.cursor = "";
        popup.remove();
      });

  // Event listener to log camera position, zoom level, and bearing
  map.on('moveend', () => {
    const center = map.getCenter();
    const zoom = map.getZoom();
    const bearing = map.getBearing();
    const pitch = map.getPitch();
    console.log(`Map center: Latitude ${center.lat}, Longitude ${center.lng}`);
    console.log(`Zoom level: ${zoom}`);
    console.log(`Bearing: ${bearing} degrees`);
    console.log(`Pitch: ${pitch} degrees`)
  });

    });

    return () => {

      map.remove();
      
    };

  }, []);

  const papaPromise = (url) => new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: resolve,
      error: reject
    });
  });

  return (
    <div>
      <div style={{ position: 'absolute', top: 50, right: 10, zIndex: 10000, backgroundColor: 'aliceblue' }}>
      </div>
      <div id="map" style={{ position: 'absolute', top: 0, bottom: 0, width: '100%' }}></div>
    </div>
  );
};

export default CoiVsSingleFamilyMapComponent;

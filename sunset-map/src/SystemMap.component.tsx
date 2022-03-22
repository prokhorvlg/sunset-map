import React from "react";
import * as d3 from "d3";
//import { zoom } from "https://cdn.skypack.dev/d3-zoom@3";

const enum ObjectType {
    Sun,
    Planet,
    Moon,
    AsteroidBelt
}

// Data for generation of objects
const data = {
    name: "Sol",
    type: ObjectType.Sun,
    distance: 0,
    radius: 35,
    worlds: [
        {
            name: "Mercury",
            type: ObjectType.Planet,
            distance: 125,
            radius: 8,
            speed: -1.60,
            startingAngle: 35,
            moons: []
        },
        {
            name: "Venus",
            type: ObjectType.Planet,
            distance: 165,
            radius: 15,
            speed: -1.17,
            startingAngle: 195,
            moons: [
                {
                    name: "Klios",
                    type: ObjectType.Moon,
                    distance: 66,
                    radius: 5,
                    speed: -3.2,
                    startingAngle: 320
                }
            ]
        },
        {
            name: "Earth",
            type: ObjectType.Planet,
            distance: 205,
            radius: 14,
            speed: -1.17,
            startingAngle: 280,
            moons: [
                {
                    name: "Luna",
                    type: ObjectType.Moon,
                    distance: 66,
                    radius: 5,
                    speed: -3.2,
                    startingAngle: 119
                }
            ]
        },
        {
            name: "Mars",
            type: ObjectType.Planet,
            distance: 245,
            radius: 11,
            speed: -1.17,
            startingAngle: 64,
            moons: []
        },
        {
            name: "Asteroid Belt",
            type: ObjectType.AsteroidBelt,
            distance: 295,
            radius: 11,
            speed: -1.17,
            startingAngle: 44,
            moons: []
        },
        {
            name: "Jupiter",
            type: ObjectType.Planet,
            distance: 355,
            radius: 29,
            speed: -1.17,
            startingAngle: 145,
            moons: [
                {
                    name: "Io",
                    type: ObjectType.Moon,
                    distance: 86,
                    radius: 4,
                    speed: -3.2,
                    startingAngle: 22
                },
                {
                    name: "Europa",
                    type: ObjectType.Moon,
                    distance: 115,
                    radius: 5,
                    speed: -3.2,
                    startingAngle: 259
                },
                {
                    name: "Ganymede",
                    type: ObjectType.Moon,
                    distance: 145,
                    radius: 6,
                    speed: -3.2,
                    startingAngle: 155
                },
                {
                    name: "Callisto",
                    type: ObjectType.Moon,
                    distance: 175,
                    radius: 5,
                    speed: -3.2,
                    startingAngle: 43
                }
            ]
        },
        {
            name: "Saturn",
            type: ObjectType.Planet,
            distance: 435,
            radius: 26,
            speed: -1.17,
            startingAngle: 310,
            moons: [
                {
                    name: "Titan",
                    type: ObjectType.Moon,
                    distance: 105,
                    radius: 5,
                    speed: -3.2,
                    startingAngle: 73
                }
            ]
        },
        {
            name: "Uranus",
            type: ObjectType.Planet,
            distance: 545,
            radius: 19,
            speed: -1.17,
            startingAngle: 340,
            moons: []
        },
        {
            name: "Neptune",
            type: ObjectType.Planet,
            distance: 655,
            radius: 18,
            speed: -1.17,
            startingAngle: 224,
            moons: []
        },
        {
            name: "Pluto",
            type: ObjectType.Planet,
            distance: 725,
            radius: 5,
            speed: -1.17,
            startingAngle: 11,
            moons: [
                {
                    name: "Charon",
                    type: ObjectType.Moon,
                    distance: 45,
                    radius: 3,
                    speed: -3.2,
                    startingAngle: 165
                }
            ]
        },
        {
            name: "Kuiper Belt",
            type: ObjectType.AsteroidBelt,
            distance: 955,
            radius: 0,
            speed: -1.17,
            startingAngle: 0,
            moons: []
        },
        {
            name: "Nibiru",
            type: ObjectType.Planet,
            distance: 1205,
            radius: 36,
            speed: -1.17,
            startingAngle: 32,
            moons: [
                {
                    name: "Marduk",
                    type: ObjectType.Moon,
                    distance: 135,
                    radius: 4,
                    speed: -3.2,
                    startingAngle: 73
                }
            ]
        },
    ]
}

const DISTANCE_FACTOR = 1.2;
const SCALE_FACTOR = 2;

const findNewPoint = (x, y, angle, distance) => {
    const result = {} as any;

    result.x = Math.round(Math.cos(angle * Math.PI / 180) * distance + x);
    result.y = Math.round(Math.sin(angle * Math.PI / 180) * distance + y);

    return result;
}

const generateWorld = (worldGroup, worldData, coordsX = 0, coordsY = 0, parentX = 0, parentY = 0) => {
    const worldOrbitGroup = worldGroup.append("g"); // Positioned at center (orbit line)
    const worldItemGroup = worldGroup.append("g"); // Positioned at coordinates (the rest)

    // Generate ORBIT PATH of PLANET
    worldOrbitGroup.append("circle")
        .attr("cx", parentX)
        .attr("cy", parentY)
        .attr("r", worldData.distance * DISTANCE_FACTOR)
        .attr("stroke-linecap", "round")
        .attr("stroke-dasharray", "5,3")
        .attr("class", "orbit");

    // Generate NAME of PLANET
    worldItemGroup.append("text")
        .attr("x", 0)
        .attr("y", -worldData.radius * SCALE_FACTOR - 15)
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .text(worldData.name);

    // Generate PLANET
    worldItemGroup.append("circle")
        .attr("r", worldData.radius * SCALE_FACTOR)
        .attr("class", "planet");

    // Send item group to coordinates
    worldItemGroup.attr("transform", "translate(" + coordsX + "," + coordsY + ")");
}

const generateAsteroidBelt = (worldGroup, worldData, coordsX = 0, coordsY = 0, parentX = 0, parentY = 0) => {
    const worldOrbitGroup = worldGroup.append("g"); // Positioned at center (orbit line)

    // Generate ORBIT PATH of BELT
    worldOrbitGroup.append("circle")
        .attr("cx", parentX)
        .attr("cy", parentY)
        .attr("r", worldData.distance * DISTANCE_FACTOR)
        .attr("stroke-linecap", "round")
        .attr("stroke-dasharray", "0,4")
        .attr("stroke-width", "2")
        .attr("class", "orbit");
}

const handleMap = (element) => {
    const w = window.innerWidth - 20;
    const h = window.innerHeight - 20;

    // Generate SVG element
    const svgEl = d3.select(element);
    svgEl.selectAll("*").remove();
    const svg = svgEl
        .attr("width", w)
        .attr("height", h)

    // GENERATE COSMIC OBJECTS
    // Generate container for all cosmic objects
    const container = svg.append("g")
        .attr("id", "orbit_container")
        .attr("transform", "translate(" + 0 + "," + 0 + ")");

    // Generate SUN
    const sunCircle = container.append("circle")
       .attr("r", data.radius * SCALE_FACTOR)
       .attr("cx", 0)
       .attr("cy", 0)
       .attr("id", "sun");

    // Generate EACH PLANET
    // Generate planet cluster
    const planetGroups = container.selectAll("g.planet")
        .data(data.worlds).enter().append("g")
        .attr("class", "planet_cluster")
        
    planetGroups.each(function(world, i) {
        const planetGroup = d3.select(this);
        const planetPoint = findNewPoint(0, 0, world.startingAngle, world.distance * DISTANCE_FACTOR);

        if (world.type === ObjectType.AsteroidBelt) {
            generateAsteroidBelt(d3.select(this), world, planetPoint.x, planetPoint.y)
        } else {
            generateWorld(d3.select(this), world, planetPoint.x, planetPoint.y);

            // Generate each MOON for this PLANET
            const moonGroups = planetGroup.append("g").selectAll("g.moon").data(world.moons).enter()
                .append("g")
                .attr("class", "moon_cluster")
            
            moonGroups.each(function(moon, i) {
                const moonPoint = findNewPoint(planetPoint.x, planetPoint.y, moon.startingAngle, moon.distance * DISTANCE_FACTOR);
                generateWorld(d3.select(this), moon, moonPoint.x, moonPoint.y, planetPoint.x, planetPoint.y);
            });
        }
        

        
    })

    // Rotation about orbit
    /*setInterval(function() {
    //setTimeout(function() {
        var delta = (Date.now() - t0);
        svg.selectAll(".planet_cluster, .moon_cluster").attr("transform", function(d) {
            return "rotate(" + (d.startingAngle + (delta * (d.speed/100))) + ")";
        });
    }, 40);*/

    // Enable zoom component
    const panLimitX = 1500;
    const panLimitY = panLimitX * 0.7;
    const zoom = d3.zoom()
        .extent([[0, 0], [w, h]])
        .scaleExtent([1, 12])
        .translateExtent([[-panLimitX, -panLimitY], [panLimitX, panLimitY]])
        //.extent([-panLimit, -panLimit], [panLimit, panLimit])
        .on("zoom", zoomed)
    svg.call(zoom);

    // Initial zoom and scale
    const initialTransform = d3.zoomIdentity
        .translate(w/2, h/2)
        .scale(1);
    svg.call(zoom.transform, initialTransform);
    
    function zoomed({transform}) {
        container.attr("transform", transform);
    }
}

const SystemMap = () => {
    return <svg ref={handleMap}></svg>
};
 
export default SystemMap;

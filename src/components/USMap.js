import { useState, useEffect } from "react"
import ProgressBar from "./progressBar"
import * as d3 from "d3"
import * as topojson from "topojson"
import Filter from "./filter"
import ca_data from "../data/CA.json"
import tx_data from "../data/TX.json"

import styles from "./styles.module.css"

function USMap() {
	const [selectState, setSelectState] = useState("Select State")
	const [selectYear, setSelectYear] = useState("Select Year")
	const [progress, setProgress] = useState(0)

	const stateChangeHandler = value => {
		if (isNaN(+value)) {
			setSelectState(value)
		} else {
			setSelectYear(value)
		}
	}

	const progressChangeHandler = curProgress => {
		setProgress(curProgress)
	}

	useEffect(() => {
		async function render() {
			let renderData
			if (
				selectState === "Select State" ||
				selectState === "United States"
			) {
				const mapData = await fetch(
					"https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/counties.json",
				).then(res => res.json())

				renderData = topojson.feature(
					mapData,
					mapData.objects.counties,
				).features
			}

			if (selectState === "California") {
				renderData = topojson.feature(
					ca_data,
					ca_data.objects.cb_2015_california_county_20m,
				).features
			}

			if (selectState === "Texas") {
				renderData = topojson.feature(
					tx_data,
					tx_data.objects.cb_2015_texas_county_20m,
				).features
			}

			const eduData = await fetch(
				"https://raw.githubusercontent.com/no-stack-dub-sack/testable-projects-fcc/master/src/data/choropleth_map/for_user_education.json",
			).then(res => res.json())

			if (progress !== 0) {
				eduData.forEach(edu => {
					edu.bachelorsOrHigher = (
						edu.bachelorsOrHigher +
						progress / 2
					).toFixed(2)
				})
			}

			if (selectYear !== "Select Year") {
				eduData.forEach(edu => {
					edu.bachelorsOrHigher = (
						edu.bachelorsOrHigher *
						(+selectYear - 2017)
					).toFixed(2)
				})
			}

			const w = 1200
			const h = 600
			// const padding = 70

			// clear svg
			const chart = document.getElementById("theChart")
			if (chart) {
				chart.innerHTML = ""
			}

			const svg = d3
				.select("#theChart")
				.append("svg")
				.attr("width", w)
				.attr("height", h)
				.attr("align-self", "center")
			// .attr("transform", "scale(1, -1)")

			svg.selectAll("path")
				.data(renderData)
				.enter()
				.append("path")
				.attr("d", d3.geoPath())
				.attr("class", d => {
					// console.log(d)
					return handleGetBachelors(d)
				})
				.on("mouseover", handleMouseOver)
				.on("mouseout", handleMouseOut)

			function handleGetBachelors(d) {
				for (let i = 0; i < eduData.length; i++) {
					if (
						d.id === eduData[i].fips ||
						eduData[i].area_name.startsWith(d?.properties.NAME)
					) {
						return handleGetColor(eduData[i].bachelorsOrHigher)
					}
				}
			}

			function handleGetColor(x) {
				if (x <= 12) {
					return "color-01"
				} else if (x > 12 && x <= 21) {
					return "color-02"
				} else if (x > 21 && x <= 30) {
					return "color-03"
				} else if (x > 30 && x <= 39) {
					return "color-04"
				} else if (x > 39 && x <= 48) {
					return "color-05"
				} else if (x > 48 && x <= 57) {
					return "color-06"
				} else if (x > 57) {
					return "color-07"
				} else {
					return "color-error"
				}
			}

			var tooltip = d3
				.select("#theChart")
				.append("div")
				.style("position", "absolute")
				.style("visibility", "hidden")
				.style("background-color", "#edf8c2")
				.style("color", "black")
				.style("border", "solid")
				.style("border-width", "0px")
				.style("border-radius", "15px")
				.style("padding", "10px")
				.style("box-shadow", "2px 2px 20px")
				.style("opacity", "0.85")
				.attr("id", "tooltip")

			function handleMouseOver(event, d) {
				d3.select(this).attr("stroke", "black")
				tooltip
					.style("visibility", "visible")
					.style("top", event.pageY - 40 + "px")
					.style("left", event.pageX + 10 + "px")
					.html(
						"<center> " +
							handleGetLocation(d.id || d.properties.NAME) +
							" </center>",
					)
			}

			function handleGetLocation(x) {
				for (let i = 0; i < eduData.length; i++) {
					if (
						x === eduData[i].fips ||
						eduData[i].area_name.startsWith(x)
					) {
						return (
							eduData[i].area_name +
							", " +
							eduData[i].state +
							": " +
							eduData[i].bachelorsOrHigher +
							"%"
						)
					}
				}
			}

			function handleMouseOut(event, d) {
				d3.select(this).attr("stroke", "none")
				tooltip.style("visibility", "hidden")
			}

			// Begin legend stuff

			const legW = w / 5
			const legH = 20
			const legendColors = [12, 21, 30, 39, 48, 57, 66]

			let legend = svg
				.append("g")
				.attr("transform", "translate(900, 300)")
				.attr("id", "legend")

			// console.log(legend)

			let xScale = d3.scaleLinear().domain([0, 70]).range([0, legW])

			let xAxis = d3
				.axisBottom()
				.scale(xScale)
				.ticks(7)
				.tickSize(30)
				.tickFormat(
					(d, i) =>
						["3%", "12%", "21%", "30%", "39%", "48%", "57%", "66%"][
							i
						],
				)

			legend
				.selectAll("rect")
				.data(legendColors)
				.enter()
				.append("rect")
				.attr("width", legW / legendColors.length)
				.attr("height", legH)
				.attr("x", (d, i) => i * (legW / legendColors.length))
				.attr("class", d => handleGetColor(d))

			legend.append("g").call(xAxis)
		}
		render()
	}, [selectState, selectYear, progress])

	return (
		<div id='container'>
			<h1 id='title'>United States Food Assistance Dashboard</h1>
			<div id='description'>
				Percentage of food assistance application collected by Google
				Trends (2018-2020)
			</div>
			<div style={{ display: "flex", justifyContent: "space-between" }}>
				<ProgressBar progressChange={progressChangeHandler} />

				<div className={styles.filterRoot}>
					<Filter
						title={"Select Year"}
						datas={[2018, 2019, 2020]}
						id='year'
						stateChange={stateChangeHandler}
						className={styles.filter}
					/>
					<Filter
						title={"Select State"}
						datas={["United States", "California", "Texas"]}
						id='state'
						stateChange={stateChangeHandler}
						className={styles.filter}
					/>
				</div>
			</div>

			<div id='theChart'></div>
			<div id='theLegend'></div>
		</div>
	)
}

export default USMap

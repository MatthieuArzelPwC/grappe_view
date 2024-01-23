<script>
import * as d3 from "d3";
import * as utils from "./utils.js";

export default {
  name: "BubbleGraph",
  props: {
    bubbleGraphProps: {
      data: [
        Array,
        {
          value: Number,
          label: String,
          score: Number | null,
          tooltip: String,
        },
      ],
      graphName: String,
      numberOfColumns: Number,
      useLogarithmicScale: Boolean,
      LogarithmicFactor: Number,
      maxRadius: Number,
      minRadius: Number,
      height: Number,
      isScoreGraph: Boolean,
      highScoreColor: String,
      mediumScoreColor: String,
      lowScoreColor: String,
      textColor: String,
    },
  },
  setup(props) {
    const graphId =
      "my_dataviz" + props.bubbleGraphProps.graphName.replaceAll(" ", "_");
    return { graphId };
  },
  watch: {
    bubbleGraphProps: {
      handler: function () {
        this.renderGraph();
      },
      deep: true,
    },
  },

  methods: {
    renderGraph() {
      const { data, width, height, size } = utils.getGraphParameters(
        this.bubbleGraphProps,
        this.$refs.container
      );

      const graphName =
        "#my_dataviz" + this.bubbleGraphProps.graphName.replaceAll(" ", "_");

      //Remove everything from the graph
      let graph = d3.select(graphName);
      graph.selectAll("*").remove();

      // Append the SVG object to the body of the page
      let svg = graph.append("svg").attr("width", width).attr("height", height);

      // Initialize the circle: all located at the center of the SVG area
      let node = svg.append("g").selectAll("circle").data(data).enter();

      const colorScale = utils.getColorScale(
        data,
        this.bubbleGraphProps.highScoreColor,
        this.bubbleGraphProps.mediumScoreColor,
        this.bubbleGraphProps.lowScoreColor
      );

      let bubble = node
        .append("circle")
        .attr("class", "node")
        .attr("r", (d) => size(d.value))
        .attr("cx", width / 2)
        .attr("cy", height / 2)
        .style("fill", (d) =>
          utils.getCircleColor(
            d.score,
            colorScale,
            this.bubbleGraphProps.isScoreGraph
          )
        )
        .style("fill-opacity", 1)
        .call(
          d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        );

      let bubbleText = utils.addBubbleText(
        node,
        size,
        width,
        height,
        this.bubbleGraphProps.textColor
      );

      const globalContainer = this.$refs.container;

      utils.addTooltip(globalContainer, graphName, bubble);

      // Features of the forces applied to the nodes
      var simulation = d3
        .forceSimulation()
        .force(
          "x",
          d3
            .forceX()
            .strength(0.1)
            .x(width / 2)
        )
        .force(
          "y",
          d3
            .forceY()
            .strength(0.5)
            .y((d) => (d.totalPreviousRadius - size(d.value) / 2) * 0.8)
        )
        .force("charge", d3.forceManyBody().strength(0.1))
        .force(
          "collide",
          d3
            .forceCollide()
            .strength(1)
            .radius((d) => size(d.value))
            .iterations(1)
        );

      //Run the simulation within the svg border
      simulation.nodes(data).on("tick", () => {
        bubble
          .attr(
            "cx",
            (d) =>
              (d.x = Math.max(
                size(d.value),
                Math.min(width - size(d.value), d.x)
              ))
          )
          .attr(
            "cy",
            (d) =>
              (d.y = Math.max(
                size(d.value),
                Math.min(height - size(d.value), d.y)
              ))
          );
        bubbleText
          .attr("x", (d) =>
            Math.max(size(d.value), Math.min(width - size(d.value), d.x))
          )
          .attr("y", (d) =>
            Math.max(size(d.value), Math.min(height - size(d.value), d.y))
          );
      });

      // What happens when a circle is dragged?
      function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      }

      function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      }

      function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3);
        d.fx = null;
        d.fy = null;
      }
    },
  },
  mounted() {
    this.renderGraph();
  },
};
</script>

<template>
  <div class="container" ref="container">
    <div :id="`${graphId}`"></div>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  flex-grow: 1;
  height: 100%;
}

.heavy {
  font: bold 30px sans-serif;
}
</style>

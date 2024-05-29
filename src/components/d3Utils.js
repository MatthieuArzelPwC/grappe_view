import * as d3 from "d3";

export const addCircles = (
  node,
  width,
  height,
  data,
  sizeScale,
  simulation,
  colors,
  isScoreGraph
) => {
  return node
    .append("circle")
    .attr("class", "node")
    .attr("r", (d) => sizeScale(d.value))
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .style("fill", (d) =>
      getCircleColor(d.score, getColorScale(data, colors), isScoreGraph)
    )
    .style("fill-opacity", 1)
    .call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );
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
};

const getColorScale = (data, colors) => {
  const maxScore = Math.max(...data.map((x) => x.score));
  const minScore = Math.min(...data.map((x) => x.score));
  const getColorOrDefault = (color, defaultColor) => color || defaultColor;

  const colorScale = d3
    .scaleLinear()
    .domain([minScore, (maxScore + minScore) / 2, maxScore])
    .range([
      getColorOrDefault(colors.low, "#FF6347"),
      getColorOrDefault(colors.medium, "#FFD700"),
      getColorOrDefault(colors.high, "#4CAF50"),
    ]);
  return colorScale;
};

const getCircleColor = (score, colorScale, isScoreGraph) => {
  return isScoreGraph & (score !== null) ? colorScale(score) : "#D1D1D1";
};

export const addBubbleText = (node, sizeScale, width, height, textColor) => {
  return node
    .append("text")
    .text((d) => d.label)
    .attr("x", width / 2)
    .attr("y", height / 2)
    .attr("pointer-events", "none")
    .style("text-anchor", "middle")
    .style("font-weight", "bold")
    .style("font-family", "Helvetica Neue")
    .style("font-size", (d) => `${getFontSize(d.value, sizeScale)}pt`)
    .style("fill", textColor)
    .each(function (d) {
      svgTextEllipsis(this, sizeScale(d.value) * 2);
    });
};

const svgTextEllipsis = (textNode, width) => {
  const d3Node = d3.select(textNode);
  const targetWidth = width - width * 0.2;
  const initialText = d3Node.text();

  let textWidth = d3Node.node().getComputedTextLength() ?? 0;
  let textLength = initialText.length;
  let text = initialText;

  if (textWidth < targetWidth) return;

  while (textLength > 0 && targetWidth < textWidth) {
    text = text.slice(0, textLength - 1);
    d3Node.text(`${text}…`);
    textWidth = d3Node.node()?.getComputedTextLength() ?? 0;
    textLength = text.length;
  }
};

const getFontSize = (dataValue, sizeScale) => {
  const fontSize = sizeScale(dataValue) / 5;
  return fontSize > 4 ? fontSize : 0;
};

export const addTooltip = (globalContainer, graphName, node) => {
  let tooltip = d3
    .select(graphName)
    .append("div")
    .attr("pointer-events", "none")
    .style("position", "absolute")
    // .style("width", "250px")
    .style("visibility", "hidden")
    .style("border-radius", "5px")
    .style("padding", "12px")
    .style("background-color", "#252525")
    // .style("border-size", "1px")
    // .style("border-color", "#2B2E3B")
    .style("color", "#EEEEEE")
    .style("opacity", "1")
    .style("z-index", "10")
    .style("font-size", "14pt")
    // .style("font-weight", "300");

  const tooltipText = tooltip
    .append("div")
    .style("margin", "0px")
    .style("white-space", "pre-line");

  node
    .on("mouseover", (event, d) => {
      if (!d.tooltip || d.tooltip === "") {
        return tooltip;
      }
      return tooltip.style("visibility", "visible");
    })
    .on("mousemove", (event, d) => {
      const yDelta = globalContainer.getBoundingClientRect().y;
      const xDelta = globalContainer.getBoundingClientRect().x;
      tooltipText.text(d.tooltip);
      return tooltip
        .style("top", event.pageY - yDelta - window.scrollY + 10 + "px")
        .style("left", event.pageX - xDelta + 10 + "px");
    })
    .on("mouseout", () => {
      return tooltip.style("visibility", "hidden");
    });
};

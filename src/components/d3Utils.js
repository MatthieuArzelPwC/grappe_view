import * as d3 from "d3";
import { getColor, getColorScale } from "../utils/colors";

export const addCircles = (
  node,
  width,
  height,
  data,
  sizeScale,
  simulation,
  colors,
  borders,
  isScoreGraph,
) => {
  const tmpNode = node
    .append("circle")
    .attr("class", "node")
    .attr("cx", width / 2)
    .attr("cy", height / 2)
    .style("fill", (d) =>
      getColor(d.score, getColorScale(data, colors), isScoreGraph)
    )
    .style("fill-opacity", 1);
  if (borders.enabled) {
    tmpNode
      .attr("r", (d) => {
        const tmp = sizeScale(d.value) - (d.borderWidth || borders.width || 0) / 2
        console.log('r', tmp)
        return tmp
      })
      .style("stroke", (d) =>
        d.borderColor || getColor(d.score, getColorScale(data, borders.colors, "score"), isScoreGraph)
      )
      .style("stroke-width", d => d.borderWidth || borders.width)
      .style('stroke-opacity', 1)
  } else {
    tmpNode.attr("r", (d) => sizeScale(d.value));
  }
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
  return tmpNode
    .call(
      d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );
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
  return Math.min(fontSize > 4 ? fontSize : 0, 16);
};

export const addTooltip = (globalContainer, graphName, node) => {
  let tooltip = d3
    .select(graphName)
    .append("div")
    .attr("pointer-events", "none")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("min-width", "200px")
    .style("max-width", "200px")
    .style("border-radius", "5px")
    .style("padding", "12px")
    .style("background-color", "#252525")
    .style("border", "1px solid #2B2E3B")
    .style('border-radius', '10px')
    .style("color", "#EEEEEE")
    .style("opacity", "1")
    .style("z-index", "10")
    .style("font-size", "10pt")
    .style("font-weight", "300");

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

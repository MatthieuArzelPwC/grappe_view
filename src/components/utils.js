import * as d3 from "d3";

export const getGraphParameters = (graphProps, container) => {
  const data = graphProps.data;

  const numberOfColumns = graphProps.numberOfColumns;

  const minRadius = graphProps.minRadius === 0 ? 5 : graphProps.minRadius;

  const { width, height, maxRadius } = getSvgDimension(
    data,
    container.clientHeight,
    container.clientWidth,
    graphProps.useLogarithmicScale,
    graphProps.LogarithmicFactor,
    minRadius
  );

  const size = getSizeScale(
    graphProps.useLogarithmicScale,
    graphProps.LogarithmicFactor,
    data,
    maxRadius,
    minRadius
  );

  const newData = dataSorter(data, graphProps.isScoreGraph);

  return {
    data: newData,
    width,
    height,
    size,
    numberOfColumns,
  };
};
const getSizeScale = (
  useLogarithmicScale,
  LogarithmicFactor,
  data,
  maxRadius,
  minRadius
) => {
  const maxValue = Math.max(...data.map((x) => x.value));

  return useLogarithmicScale
    ? d3
        .scalePow()
        .exponent(LogarithmicFactor)
        .domain([0, maxValue])
        .range([minRadius, maxRadius])
    : d3.scaleLinear().domain([0, maxValue]).range([minRadius, maxRadius]);
};

const getSvgDimension = (
  data,
  containerHeight,
  containerWidth,
  useLogarithmicScale,
  LogarithmicFactor,
  minRadius
) => {
  const width = containerWidth;
  const height = containerHeight ? containerHeight : containerWidth;
  let minDichotomyRadius = minRadius;
  let maxDichotomyRadius = Math.min(width, height) * 2;
  const rectangleArea = (width * height) / 2;
  let maxRadius = (minDichotomyRadius + maxDichotomyRadius) / 2;
  let circlesArea = getTotalCirclesArea(
    data,
    maxRadius,
    useLogarithmicScale,
    LogarithmicFactor,
    minRadius
  );
  while (Math.abs(circlesArea - rectangleArea) > 0.1) {
    if (circlesArea - rectangleArea > 0) {
      maxDichotomyRadius = maxRadius;
      maxRadius = (minDichotomyRadius + maxDichotomyRadius) / 2;
    } else {
      minDichotomyRadius = maxRadius;
      maxRadius = (minDichotomyRadius + maxDichotomyRadius) / 2;
    }
    circlesArea = getTotalCirclesArea(
      data,
      maxRadius,
      useLogarithmicScale,
      LogarithmicFactor,
      minRadius
    );
  }
  return { width, height, maxRadius };
};

const getTotalCirclesArea = (
  data,
  maxRadius,
  useLogarithmicScale,
  LogarithmicFactor,
  minRadius
) => {
  const sizeScale = getSizeScale(
    useLogarithmicScale,
    LogarithmicFactor,
    data,
    maxRadius,
    minRadius
  );
  return data.reduce(
    (acc, x) => acc + 3.14 * sizeScale(x.value) * sizeScale(x.value),
    0
  );
};

const dataSorter = (data, isScoreGraph) => {
  let acc = -1;
  if (isScoreGraph) {
    return data
      .sort((a, b) => scoreComparison(a, b))
      .map((d) => {
        acc += 1;
        return { ...d, index: acc };
      });
  }
  return data
    .sort((a, b) => b.value - a.value)
    .map((d) => {
      acc += 1;
      return { ...d, index: acc };
    });
};

const scoreComparison = (a, b) => {
  if (a === null) {
    return 1;
  }
  if (b === null) {
    return -1;
  }
  return b.score - a.score;
};

export const getColorScale = (data, highColor, mediumColor, lowColor) => {
  const maxScore = Math.max(...data.map((x) => x.score));
  const minScore = Math.min(...data.map((x) => x.score));

  const colorScale = d3
    .scaleLinear()
    .domain([minScore, (maxScore + minScore) / 2, maxScore])
    .range([lowColor, mediumColor, highColor]);
  return colorScale;
};

export const getCircleColor = (score, colorScale, isScoreGraph) => {
  return isScoreGraph & (score !== null) ? colorScale(score) : "#D1D1D1";
};

export const addBubbleText = (node, size, width, height, textColor) => {
  return node
    .append("text")
    .text((d) => d.label)
    .attr("x", width / 2)
    .attr("y", height / 2)
    .attr("pointer-events", "none")
    .style("text-anchor", "middle")
    .style("font-weight", "bold")
    .style("font-family", "Helvetica Neue")
    .style("font-size", (d) => `${getFontSize(d.value, size)}pt`)
    .style("fill", textColor)
    .each(function (d) {
      svgTextEllipsis(this, size(d.value) * 2);
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

const getFontSize = (dataValue, size) => {
  const fontSize = size(dataValue) / 5;
  return fontSize > 4 ? fontSize : 0;
};

export const addTooltip = (globalContainer, graphName, bubble) => {
  let tooltip = d3
    .select(graphName)
    .append("div")
    .attr("pointer-events", "none")
    .style("position", "absolute")
    .style("visibility", "hidden")
    .style("border-radius", "5px")
    .style("padding", "8px")
    .style("background-color", "black")
    .style("color", "white")
    .style("opacity", "0.6")
    .style("z-index", "10")
    .style("font-size", "16pt");

  const tooltipText = tooltip
    .append("div")
    .style("margin", "0px")
    .style("white-space", "pre-line");

  bubble
    .on("mouseover", () => {
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

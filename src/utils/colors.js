import * as d3 from "d3";
import Color from 'color';

export const getColor = (score, colorScale, isScoreGraph) => {
    return isScoreGraph & (score !== null) ? colorScale(score) : "#D1D1D1";
};

export const getColorScale = (data, colors) => {
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

  export const darkenColor = (color, amount = 20) => {
    const darkenedColor = Color(color).darken(amount / 100).hex();
    return darkenedColor;
  }

import { getColor } from "./colors";

export const getBorderWidth = (border, data) => {
    if (!data.borderWidth) {
        return border.width || 0;
    }
    return data.borderWidth;
}

export const getBorderColor = (colorScale, data) => {
    if (!data.borderColor) {
        return getColor(data.value, colorScale, true)
    }
    return data.borderColor;
}
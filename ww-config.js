export default {
  editor: {
    label: {
      en: "My Element",
    },
  },
  properties: {
    graphName: {
      label: {
        en: "Name",
      },
      type: "Text",
      required: true,
      bindable: true,
    },
    numberOfColumns: {
      label: {
        en: "Number of Columns",
      },
      type: "Number",
      options: {
        min: 1,
        max: 10,
        defaultValue: 2,
      },
      bindable: true,
    },
    isScoreGraph: {
      label: {
        en: "Use score for graph hierarchies",
      },
      type: "OnOff",
      defaultValue: false,
      bindable: true,
    },
    useLogarithmicScale: {
      label: {
        en: "Display value on logarithmic scale",
      },
      type: "OnOff",
      defaultValue: false,
      bindable: true,
    },
    LogarithmicFactor: {
      label: {
        en: "Logarithmic factor",
      },
      type: "Number",
      options: {
        min: 0,
        max: 1,
        step: 0.1,
        defaultValue: 0.5,
      },
      bindable: true,
    },
    minRadius: {
      label: {
        en: "Minimum bubble radius",
      },
      type: "Number",
      options: {
        min: 5,
        max: 100,
        step: 5,
        defaultValue: 0,
      },
      bindable: true,
    },
    maxRadius: {
      label: {
        en: "Maximum bubble radius",
      },
      type: "Number",
      options: {
        min: 50,
        max: 1000,
        step: 10,
        defaultValue: 0,
      },
      bindable: true,
    },
    height: {
      label: {
        en: "Height of the graph (% of the width)",
      },
      type: "Number",
      options: {
        min: 0,
        max: 500,
        step: 10,
        defaultValue: 0,
      },
      bindable: true,
    },
    highScoreColor: {
      label: {
        en: "Color of the bubble with the highest score",
      },
      type: "Color",
      options: {
        defaultValue: "#4CAF50",
      },
      bindable: true,
    },
    mediumScoreColor: {
      label: {
        en: "Color of the bubble with the medium score",
      },
      type: "Color",
      options: {
        defaultValue: "#FFD700",
      },
      bindable: true,
    },
    lowScoreColor: {
      label: {
        en: "Color of the bubble with the lowest score",
      },
      type: "Color",
      options: {
        defaultValue: "#FF6347",
      },
      bindable: true,
    },
    textColor: {
      label: {
        en: "Color of the text of the bubble",
      },
      type: "Color",
      options: {
        defaultValue: "#000000",
      },
      bindable: true,
    },
    id: {
      label: {
        en: "id of the graph",
      },
      type: "OnOff",
      bindable: true,
    },
    data: {
      label: {
        en: "Data",
      },
      type: "Array",
      options: {
        item: {
          type: "Object",
          label: {
            en: "item",
          },
          options: {
            text: {
              type: "Text",
              label: {
                en: "text",
              },
            },
            value: {
              type: "Number",
              label: {
                en: "value",
              },
            },
          },
        },
      },
      defaultValue: [],
      bindable: true,
    },
  },
};

# Element component starter

This is an element for [weweb.io](https://www.weweb.io/).

## Installation

To run locally, first of all choose if you want to run the component using weweb or directly in vue.
For weweb stay on the main branch, for vue go to local branch.
Then run `npm i`

## Start

To serve locally for weweb , run `npm run serve --port=[PORT]` and then go to Weweb editor, open developper popup and add your custom element. For vue run `npm run local-serve` ang go to your localhost.

## Build

Before release, you can check build error by running `npm run build --name=my-element`

## Adding to weweb

To add this component to weweb you must give it a "graph name" to make it work properly. Note that this name must be unique.

The data should be an array of object with four attributes : label (the name display on the bubble), value (size of the bubble), score (only needed for score graph, define the order of the bubbles), tooltip (what is shown when hovering). Examples of data set :
  [
  {
  "label": "SARL John Doe",
  "value": 6,
  "score": 4,
  "tooltip" : "Name : SARL John Doe \n Value : 6 \n (customized tooltip)"
  },
  {
  "label": "Bruno SA",
  "value": 7,
  "score": 100,
  "tooltip" : "Name : Bruno SA \n Value : 7 \n (customized tooltip)"
  },
  {
  "label": "Julian GMBH",
  "value": 9,
  "score": 55,
  "tooltip" : "Name : Julian GMBH \n Value : 9 \n (customized tooltip)"
  },
  {
  "label": "Paul LTD",
  "value": 8,
  "score": 32,
  "tooltip" : "Name : Paul LTD \n Value : 8 \n (customized tooltip)"
  },
  {
  "label": "BV",
  "value": 10,
  "score": 90,
  "tooltip" : "Name : BV \n Value : 10 \n (customized tooltip)"
  },
  {
  "label": "Marco BV",
  "value": 7,
  "score": 78,
  "tooltip" : "Name : Marco BV \n Value : 7 \n (customized tooltip)"
  },
  {
  "label": "Le 1",
  "value": 8,
  "score": 14,
  "tooltip" : "Name : Le 1 \n Value : 8 \n (customized tooltip)"
  },
  {
  "label": "Le 2",
  "value": 9,
  "score": 62,
  "tooltip" : "Name : Le 2 \n Value : 9 \n (customized tooltip)"
  }
  ]

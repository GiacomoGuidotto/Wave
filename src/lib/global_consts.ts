import React from "react";

type Globals = {
  languages: {
    name: string
    value: string
  }[],
  themes: {
    name: string
    value: string
  }[]
}

export const globals: Globals = {
  languages: [
    {
      name:  "English",
      value: "EN"
    },
    {
      name:  "Italiano",
      value: "IT"
    }
  ],
  themes:    [
    {
      name:  "Light",
      value: "L"
    },
    {
      name:  "Dark",
      value: "D"
    }
  ]
}

export const GlobalsContext = React.createContext(globals);

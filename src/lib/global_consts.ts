import React from "react";

type Globals = {
  languages: {
    name: string
    value: string
  }[],
  themes: {
    name: string
    value: string
  }[],
  server: {
    hostname: string,
    endpoints: {
      root: string,
      auth: string,
      user: string,
      contact: string,
      group: string,
      member: string,
      message: string,
    }
  }
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
  ],
  server:    {
    hostname:  "server.wave.com/api",
    endpoints: {
      root:    "/",
      auth:    "/auth",
      user:    "/user",
      contact: "/contact",
      group:   "/group",
      member:  "/member",
      message: "/message",
    }
  }
}

export const GlobalsContext = React.createContext(globals);

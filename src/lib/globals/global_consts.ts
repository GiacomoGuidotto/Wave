import React from "react";

type Globals = {
  languages: {
    name: string;
    value: string;
  }[];
  themes: {
    name: string;
    value: string;
  }[];
  server: {
    protocol: string;
    hostname: string;
    endpoints: {
      root: string;
      auth: string;
      user: string;
      contact: string;
      group: string;
      member: string;
      message: string;
    };
    sessionDuration: number;
  };
  channel: {
    hostname: string;
    actions: string[];
  };
};

export const globals: Globals = {
  languages: [
    {
      name: "English",
      value: "EN",
    },
    {
      name: "Italiano",
      value: "IT",
    },
    {
      name: "Español",
      value: "ES",
    },
    {
      name: "Deutsch",
      value: "DE",
    },
  ],
  themes: [
    {
      name: "Light",
      value: "L",
    },
    {
      name: "Dark",
      value: "D",
    },
  ],
  server: {
    protocol: "http",
    hostname: "server.wave.com/api",
    endpoints: {
      root: "/",
      auth: "/auth",
      user: "/user",
      contact: "/contact",
      group: "/group",
      member: "/member",
      message: "/message",
    },
    sessionDuration: 900000, // 15 minutes
  },
  channel: {
    hostname: "server.wave.com/channel",
    actions: [
      "newContactRequest",
      "deletedContactRequest",
      "newContactReply",
      "newContactStatus",
      "newContactInfos",
      "newGroupInfos",
      "removedMember",
      "newMember",
      "newMemberPermission",
      "deletedGroup",
      "newMessage",
      "changedMessage",
      "deletedMessage",
    ],
  },
};

export const GlobalsContext = React.createContext(globals);

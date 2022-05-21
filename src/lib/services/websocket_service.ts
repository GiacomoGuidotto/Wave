import { ChannelActions } from "globals/globals_types";
import { store } from "store/store";
import { updateConnectedStatus, updateValidStatus } from "store/slices/channel";

// object containing all the callbacks for all che actions
const actions: {
  [K in ChannelActions]: (payload: {
    headers?: { [key: string]: string };
    body?: unknown;
  }) => void;
} = {
  createContact: () => {
    // new contact request
  },
  deleteContactStatus: () => {
    // deleted contact request
  },
  updateContactReply: () => {
    // new contact reply
  },
  updateContactStatus: () => {
    // new contact status
  },
  updateContactInformation: () => {
    // new contact infos
  },
  createGroup: () => {
    // new group
  },
  updateGroupInformation: () => {
    // new group infos
  },
  deleteGroupMember: () => {
    // removed member
  },
  createGroupMember: () => {
    // new member
  },
  updateGroupMember: () => {
    // new member permission
  },
  deleteGroup: () => {
    // deleted group
  },
  createMessage: () => {
    // new message
  },
  updateMessage: () => {
    // changed message
  },
  deleteMessage: () => {
    // deleted message
  },
};

// singleton
let instance: WebSocket;

const getInstance = () => {
  if (!instance) {
    instance = new WebSocket("ws://server.wave.com/channel");

    instance.onmessage = (message) => {
      // parse and call the right callback
      const { method, scope, headers, body } = parsePacket(message.data);

      // edge cases
      switch (method) {
        case "CONNECTED":
          store.dispatch(updateValidStatus(true));
          return;
        case "ERROR":
          console.error(`Channel error: ${body}`);
          instance.close();
          return;
      }

      // convert "VERB scope/scope" to "verbScopeScope"
      const action: ChannelActions = `${method.toLowerCase()}${scope
        .split("/")
        .map((scope) => scope.charAt(0).toUpperCase() + scope.slice(1))
        .join("")}` as ChannelActions;

      actions[action]({ headers, body });
    };

    instance.onclose = () => {
      store.dispatch(updateValidStatus(false));
      store.dispatch(updateConnectedStatus(false));
    };

    instance.onerror = () => {
      // console.error(event);
    };
  }
  return instance;
};

// parsing utility
const parsePacket = (
  packet: string
): {
  method: string;
  scope: string;
  headers?: { [key: string]: string };
  body?: unknown;
} => {
  const [header, body] = packet.split("\n\n");
  const lines = header.split("\n");
  const [method, scope] = lines[0].split(" ");
  const headers = lines.slice(1);
  let objectHeaders;
  if (headers) {
    const objectHeadersList = headers.map((header) => {
      const tuple = header
        .split(":")
        .map((tupleElement) => tupleElement.trim().replace(/['"]+/g, ""));
      return { [tuple[0]]: tuple[1] };
    });
    objectHeaders = objectHeadersList.reduce(
      (previousValue, currentValue) =>
        Object.assign(previousValue, currentValue),
      {}
    );
  }
  return {
    method: method,
    scope: scope,
    headers: objectHeaders,
    ...(body && {
      body: JSON.parse(body),
    }),
  };
};

// authenticate
export const authorizeConnection = (token: string) => {
  const connection = getInstance();

  connection.onopen = () => {
    store.dispatch(updateConnectedStatus(true));

    const packet = JSON.stringify({ token: token });
    instance.send(packet);

    connection.onopen = null;
  };
};

// override the callback for that action
export const setActionCallback = (
  action: ChannelActions,
  callback: (payload: {
    headers?: { [key: string]: string };
    body?: unknown;
  }) => void
) => {
  getInstance();
  actions[action] = callback;
};

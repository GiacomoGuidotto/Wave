import { v4 as uuid } from "uuid";
import { globals } from "globals/global_consts";
import { ErrorResponse } from "models/error_response";

const server = globals.server;
const baseUrl = `${server.protocol}://${server.hostname}`;

type ErrorPayload = {
  timestamp: string;
  error: number;
  message: string;
};

// ==== Auth ===================================================================

export const login = (
  username: string,
  password: string
): Promise<Response | ErrorResponse> => {
  const device: string = uuid();

  const url = `${baseUrl}${server.endpoints.auth}`;
  const method = "POST";
  const headers = {
    username: username,
    password: password,
    device: device,
  };

  return request(url, {
    method: method,
    headers: headers,
  });
};

export const poke = (token: string): Promise<Response | ErrorResponse> => {
  const url = `${baseUrl}${server.endpoints.auth}`;
  const method = "PUT";
  const headers = {
    token: token,
  };

  return request(url, {
    method: method,
    headers: headers,
  });
};

// ==== User ===================================================================

export const signUp = async (
  username: string,
  password: string,
  name: string,
  surname: string,
  picture: string,
  phone: string
): Promise<Response | ErrorResponse> => {
  const url = `${baseUrl}${server.endpoints.user}`;
  const method = "POST";
  const headers = {
    username: username,
    password: password,
    name: name,
    surname: surname,
    ...(phone.length && { phone: phone }),
  };
  const body = {
    ...(picture.length && { picture: picture }),
  };

  return request(url, {
    method: method,
    headers: headers,
    body: JSON.stringify(body),
  });
};

export const getUserInformation = (
  token: string
): Promise<Response | ErrorResponse> => {
  const url = `${baseUrl}${server.endpoints.user}`;
  const method = "GET";
  const headers = {
    token: token,
  };

  return request(url, {
    method: method,
    headers: headers,
  });
};

// ==== Contacts ===============================================================

export const getAllContacts = (
  token: string
): Promise<Response | ErrorResponse> => {
  const url = `${baseUrl}${server.endpoints.contact}`;
  const method = "GET";
  const headers = {
    token: token,
  };

  return request(url, {
    method: method,
    headers: headers,
  });
};

export const respondPending = (
  token: string,
  user: string,
  directive: "A" | "D" | "B"
) => {
  const url = `${baseUrl}${server.endpoints.contact}`;
  const method = "PUT";
  const headers = {
    token: token,
    user: user,
    directive: directive,
  };

  return request(url, {
    method: method,
    headers: headers,
  });
};

// ==== Groups =================================================================

export const getAllGroups = (
  token: string
): Promise<Response | ErrorResponse> => {
  const url = `${baseUrl}${server.endpoints.group}`;
  const method = "GET";
  const headers = {
    token: token,
  };

  return request(url, {
    method: method,
    headers: headers,
  });
};

// ==== Chats ===============================================================

export const isGroup = (chat: string) =>
  /^[a-fA-F\d]{8}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{4}-[a-fA-F\d]{12}$/.test(
    chat
  );

export const getSingleChat = (
  token: string,
  chat: string
): Promise<Response | ErrorResponse> => {
  const endpoint = isGroup(chat)
    ? server.endpoints.group
    : server.endpoints.contact;
  const url = `${baseUrl}${endpoint}`;
  const method = "GET";
  const headers = {
    token: token,
    ...(isGroup(chat) && { group: chat }),
    ...(!isGroup(chat) && { user: chat }),
  };

  return request(url, {
    method: method,
    headers: headers,
  });
};

const formatDate = (date: Date): string =>
  `${date.getFullYear()}-${date.getMonth().toString().padStart(2, "0")}-${date
    .getDate()
    .toString()
    .padStart(2, "0")} ${date.getHours().toString().padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;

export const getRangeMessages = (
  token: string,
  chat: string,
  from: Date,
  to: Date
): Promise<Response | ErrorResponse> => {
  const url = `${baseUrl}${server.endpoints.message}`;
  const method = "GET";
  const headers = {
    token: token,
    ...(isGroup(chat) && { group: chat }),
    ...(!isGroup(chat) && { contact: chat }),
    from: formatDate(from),
    to: formatDate(to),
  };

  return request(url, {
    method: method,
    headers: headers,
  });
};

// ==== Utility ================================================================

export const test = async (): Promise<boolean> => {
  const url = `${baseUrl}${server.endpoints.root}`;
  try {
    const result = await fetch(url);
    return result.status === 200;
  } catch (e) {
    return false;
  }
};

const request = (input: RequestInfo, init?: RequestInit | undefined) =>
  fetch(input, init).catch(() => new ErrorResponse());

export const logMessages = (
  payload: ErrorPayload,
  method: string,
  prettierMessage = ""
): void => {
  const error = new ErrorResponse(
    new Date(payload.timestamp),
    payload.error,
    payload.message,
    prettierMessage
  );
  console.error(
    `Failed to query the server from "${method}":\n`,
    `[${error.timestamp}] ${error.code} | ${
      error.prettierMessage.length === 0 ? error.message : error.prettierMessage
    }`
  );
};

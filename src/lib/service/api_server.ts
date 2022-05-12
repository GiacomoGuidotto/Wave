import { globals } from "../global_consts";
import { v4 as uuid } from "uuid";
import { ErrorResponse } from "../models/error_response";

const server = globals.server;
const baseUrl = `${server.protocol}://${server.hostname}`;

type ErrorPayload = {
  timestamp: string;
  error: number;
  message: string;
};

export const test = async (): Promise<boolean> => {
  const url = `${baseUrl}${server.endpoints.root}`;
  try {
    const result = await fetch(url);
    return result.status === 200;
  } catch (e) {
    return false;
  }
};

export const login = (
  username: string,
  password: string
): Promise<Response> => {
  const device: string = uuid();

  const url = `${baseUrl}${server.endpoints.auth}`;
  const method = "POST";
  const headers = {
    username: username,
    password: password,
    device: device,
  };

  return fetch(url, {
    method: method,
    headers: headers,
  }).then((value) => {
    if (!value.ok) console.clear();
    return value;
  });
};

export const signUp = async (
  username: string,
  password: string,
  name: string,
  surname: string,
  picture: string,
  phone: string
) => {
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

  return fetch(url, {
    method: method,
    headers: headers,
    body: JSON.stringify(body),
  }).then((value) => {
    if (!value.ok) console.clear();
    return value;
  });
};

export const logMessages = (
  payload: ErrorPayload,
  prettierMessage = ""
): void => {
  const error = new ErrorResponse(
    new Date(payload.timestamp),
    payload.error,
    payload.message,
    prettierMessage
  );
  console.error(
    "Failed to query the server:\n",
    `[${error.timestamp}] ${error.code} | ${
      error.prettierMessage.length === 0 ? error.message : error.prettierMessage
    }`
  );
};

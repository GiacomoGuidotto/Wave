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
  fetch(input, init)
    .then((value) => {
      if (!value.ok) console.clear();
      return value;
    })
    .catch(() => new ErrorResponse());

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

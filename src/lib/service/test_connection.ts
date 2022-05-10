import { globals } from "../global_consts";

export const testConnection = async (): Promise<boolean> => {
  const server = globals.server;
  const url = `${server.protocol}://${server.hostname}${server.endpoints.root}`;
  try {
    const result = await fetch(url);
    return result.status === 200;
  } catch (e) {
    return false;
  }
};

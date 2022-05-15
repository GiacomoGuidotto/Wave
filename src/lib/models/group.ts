export interface Group {
  uuid: string;
  name: string;
  info: string;
  picture: string;
  state: "N" | "P" | "A";
  muted: boolean;
}

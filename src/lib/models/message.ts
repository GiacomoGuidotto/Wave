export interface Message {
  key: string;
  timestamp: string;
  content: "M" | "I";
  text: string;
  media: string;
  authorUsername: string;
  authorName: string;
  authorSurname: string;
  authorPicture: string;
  pinned: boolean;
}

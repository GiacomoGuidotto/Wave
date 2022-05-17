export type Categories = "contacts" | "groups";

export type ChannelActions =
  | "createContact"
  | "deleteContactStatus"
  | "updateContactReply"
  | "updateContactStatus"
  | "updateContactInformation"
  | "createGroup"
  | "updateGroupInformation"
  | "deleteGroupMember"
  | "createGroupMember"
  | "updateGroupMember"
  | "deleteGroup"
  | "createMessage"
  | "updateMessage"
  | "deleteMessage";

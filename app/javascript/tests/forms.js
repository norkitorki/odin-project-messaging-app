const addMessageForm = {
  inputs: {
    chatId: {
      defaultValue: "",
      name: "chat_id",
      autoComplete: "off",
      type: "hidden",
    },
    parentId: {
      name: "message[parent_id]",
      autoComplete: "off",
      type: "hidden",
    },
    value: {
      name: "message[value]",
      autoFocus: true,
      id: "value",
      type: "textarea",
    },
    images: {
      name: "message[images][]",
      multiple: true,
      accept: "image/png,image/jpeg",
      type: "file",
      id: "images",
    },
    submit: {
      name: "commit",
      text: "Send",
      type: "submit",
    },
  },
  form: {
    action: "/messages/add",
    acceptCharset: "UTF-8",
    method: "post",
  },
};

const deleteMessageForm = {
  inputs: {
    messageId: {
      name: "message_id",
      autoComplete: "off",
      type: "hidden",
    },
    destroy: {
      defaultValue: "true",
      autoComplete: "off",
      type: "hidden",
      name: "destroy",
    },
  },
  extras: {
    method: {
      name: "_method",
      type: "hidden",
      defaultValue: "patch",
      autoComplete: "off",
    },
  },
  form: {
    action: "/messages/update",
    acceptCharset: "UTF-8",
    method: "post",
  },
};

const editMessageForm = {
  inputs: {
    messageId: {
      name: "message_id",
      autoComplete: "off",
      type: "hidden",
    },
    value: {
      name: "message[value]",
      id: "edit_value",
      type: "textarea",
    },
    images: {
      name: "message[images][]",
      type: "checkbox",
      value: "1",
      defaultChecked: false,
      uncheckedValue: "0",
      includeHidden: true,
    },
    submit: {
      name: "commit",
      text: "Update Message",
      type: "submit",
    },
  },
  extras: {
    method: {
      name: "_method",
      type: "hidden",
      defaultValue: "patch",
      autoComplete: "off",
    },
  },
  form: {
    action: "/messages/update",
    acceptCharset: "UTF-8",
    method: "post",
  },
};

export { addMessageForm, deleteMessageForm, editMessageForm };

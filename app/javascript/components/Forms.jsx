import React from "react";
import {
  Checkbox,
  Form,
  PasswordField,
  SubmitButton,
  TextArea,
  TextField,
} from "@javascript/components";
import { Delete } from "./Icons";

const ErrorMessages = ({ errors, property }) => {
  if (!errors || !errors[property]) return null;

  return (
    <div>
      {errors[property].map((message, index) => (
        <p key={index}>{message}</p>
      ))}
    </div>
  );
};

export const AddContactForm = ({ form }) => (
  <Form {...form.form} extras={form.extras} data-sg-visit>
    <input type="hidden" name="pub_id" value={user.pub_id} />
    <SubmitButton {...form.inputs.submit} />
  </Form>
);

export const AddMessageForm = ({ form, parentId = null }) => (
  <Form {...form.form} extras={form.extras} data-sg-visit>
    <input {...form.inputs.chatId} />
    {parentId && <input {...form.inputs.parentId} value={parentId} />}
    <TextArea {...form.inputs.message} />
    <input type="file" {...form.inputs.images} />
    <SubmitButton {...form.inputs.submit} />
  </Form>
);

export const ChatRequestForm = ({ form }) => (
  <Form {...form.form} extras={form.extras} data-sg-visit>
    <input {...form.inputs.chatId} />
    <input {...form.inputs.requestType} />
    <TextField {...form.inputs.receiver} label="Username" />
    <SubmitButton {...form.inputs.submit} />
  </Form>
);

export const DeleteChatForm = ({ form }) => (
  <Form {...form.form} extras={form.extras} data-sg-visit>
    <input {...form.inputs.chatId} />
    <SubmitButton {...form.inputs.submit} />
  </Form>
);

export const DeleteMessageForm = ({ form, messageId, styles }) => (
  <Form
    {...form.form}
    extras={form.extras}
    className={styles.messageDeleteForm}
    data-sg-visit
  >
    <input {...form.inputs.messageId} value={messageId} />
    <input type="hidden" name="destroy" value="true" />
    <button
      type="submit"
      title="delete message"
      className={styles.messageDeleteButton}
    >
      <Delete />
    </button>
  </Form>
);

export const DeleteUserForm = ({ form }) => (
  <Form {...form.form} extras={form.extras} data-sg-visit>
    <SubmitButton {...form.inputs.submit} />
  </Form>
);

export const EditMessageForm = ({
  form,
  message,
  imagePreviews,
  styles,
  setEditingMessage,
}) => {
  const cancelForm = () => setEditingMessage(null);

  return (
    <>
      <Form
        {...form.form}
        extras={form.extras}
        onSubmit={cancelForm}
        className={styles.messageEditForm}
        data-sg-visit
      >
        <input {...form.inputs.messageId} value={message.pub_id} />
        <textarea {...form.inputs.message} defaultValue={message.value} />
        {imagePreviews?.length > 0 && (
          <fieldset>
            <legend>Delete Images</legend>
            {imagePreviews.map((preview) => (
              <label key={preview.key}>
                <img src={preview.url} alt={preview.filename} />
                <input {...form.inputs.images} value={preview.key} />
              </label>
            ))}
          </fieldset>
        )}
        <SubmitButton {...form.inputs.submit} />
      </Form>
      <button onClick={cancelForm}>Cancel</button>
    </>
  );
};

export const FriendRequestForm = ({ form, userId }) => (
  <Form {...form.form} extras={form.extras} data-sg-visit>
    <input {...form.inputs.requestType} />
    <input {...form.inputs.receiver} value={userId} />
    <SubmitButton {...form.inputs.submit} />
  </Form>
);

export const JoinChatForm = ({ form }) => (
  <Form {...form.form} extras={form.extras} data-sg-visit>
    <input {...form.inputs.chatId} />
    <SubmitButton {...form.inputs.submit} />
  </Form>
);

export const LeaveChatForm = ({ form }) => (
  <Form {...form.form} extras={form.extras} data-sg-visit>
    <input {...form.inputs.chatId} />
    <SubmitButton {...form.inputs.submit} />
  </Form>
);

export const NewChatForm = ({ form }) => (
  <Form {...form.form} extras={form.extras} data-sg-visit>
    <TextField {...form.inputs.name} label="Name" />
    <Checkbox {...form.inputs.private} label={"Private Chat?"} />
    <SubmitButton {...form.inputs.submit} />
  </Form>
);

export const NewUserForm = ({ form }) => (
  <Form {...form.form} extras={form.extras} data-sg-visit>
    <TextField {...form.inputs.username} label={<p>Username</p>} />
    <ErrorMessages errors={form.errors} property={"username"} />
    <PasswordField {...form.inputs.password} label={<p>Password</p>} />
    <ErrorMessages errors={form.errors} property={"password"} />
    <PasswordField
      {...form.inputs.passwordConfirmation}
      label={<p>Password Confirmation</p>}
    />
    <ErrorMessages errors={form.errors} property={"password_confirmation"} />
    <SubmitButton {...form.inputs.submit} />
  </Form>
);

export const RemoveContactForm = ({ form, userId }) => (
  <Form {...form.form} extras={form.extras} data-sg-visit>
    <input {...form.inputs.userId} value={userId} />
    <SubmitButton {...form.inputs.submit} />
  </Form>
);

export const RequestResponseForm = ({ form, accept = false }) => (
  <Form {...form.form} extras={form.extras} data-sg-visit>
    <input {...form.inputs.request} />
    <input {...form.inputs.requestType} />
    {accept && <input {...form.inputs.accept} />}
    <button type="submit">{accept ? "Accept" : "Decline"}</button>
  </Form>
);

export const SignOutForm = ({ form }) => (
  <Form {...form.form} extras={form.extras} data-sg-visit>
    <SubmitButton {...form.inputs.submit} />
  </Form>
);

export const SignInForm = ({ form }) => (
  <Form {...form.form} extras={form.extras} data-sg-visit>
    <div className="field">
      <TextField {...form.inputs.username} label={<p>Username</p>} />
    </div>
    <div className="field">
      <PasswordField {...form.inputs.password} label={<p>Password</p>} />
    </div>
    <div className="actions">
      <SubmitButton {...form.inputs.submit} />
    </div>
  </Form>
);

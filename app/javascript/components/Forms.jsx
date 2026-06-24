import React from "react";
import layoutStyles from "@stylesheets/Layout.module.css";
import styles from "@stylesheets/Forms.module.css";
import {
  Checkbox,
  FileField,
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
    <div className={styles.formErrors}>
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

export const AddMessageForm = ({ form, messageValue, parentId = null }) => (
  <Form
    {...form.form}
    extras={form.extras}
    className={styles.messageForm}
    data-sg-visit
  >
    <input {...form.inputs.chatId} />
    {parentId && <input {...form.inputs.parentId} value={parentId} />}
    <TextArea
      {...form.inputs.value}
      className={styles.messageInput}
      value={messageValue}
      label="Add Message"
      required
    />
    <FileField
      {...form.inputs.images}
      className={styles.imageSelector}
      label="Images"
    />

    <SubmitButton {...form.inputs.submit} className={styles.buttonSubmit} />
  </Form>
);

export const ChatRequestForm = ({ form }) => (
  <Form {...form.form} extras={form.extras} data-sg-visit>
    <input {...form.inputs.chatId} />
    <input {...form.inputs.requestType} />
    <TextField {...form.inputs.receiver} label="Username" />
    <SubmitButton {...form.inputs.submit} className={styles.buttonSubmit} />
  </Form>
);

export const DeleteChatForm = ({ form }) => (
  <Form {...form.form} extras={form.extras} data-sg-visit>
    <input {...form.inputs.chatId} />
    <SubmitButton {...form.inputs.submit} />
  </Form>
);

export const DeleteMessageForm = ({ form, messageId }) => (
  <Form {...form.form} extras={form.extras} data-sg-visit>
    <input {...form.inputs.messageId} value={messageId} />
    <input {...form.inputs.destroy} />
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
    <SubmitButton
      {...form.inputs.submit}
      className={styles.headerUserActions}
    />
  </Form>
);

export const EditMessageForm = ({
  form,
  message,
  imagePreviews,
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
        <textarea
          {...form.inputs.value}
          className={styles.messageInput}
          defaultValue={message.value}
        />
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
        <SubmitButton {...form.inputs.submit} className={styles.buttonSubmit} />
      </Form>
    </>
  );
};

export const FriendRequestForm = ({ form, userId }) => (
  <Form {...form.form} extras={form.extras} data-sg-visit>
    <input {...form.inputs.requestType} />
    <input {...form.inputs.receiver} value={userId} />
    <SubmitButton {...form.inputs.submit} className={layoutStyles.buttonInfo} />
  </Form>
);

export const JoinChatForm = ({ form }) => (
  <Form {...form.form} extras={form.extras} data-sg-visit>
    <input {...form.inputs.chatId} />
    <SubmitButton {...form.inputs.submit} className={layoutStyles.buttonInfo} />
  </Form>
);

export const LeaveChatForm = ({ form }) => (
  <Form {...form.form} extras={form.extras} data-sg-visit>
    <input {...form.inputs.chatId} />
    <SubmitButton
      {...form.inputs.submit}
      className={layoutStyles.buttonDanger}
    />
  </Form>
);

export const NewChatForm = ({ form }) => (
  <Form
    {...form.form}
    extras={form.extras}
    className={styles.newChatForm}
    data-sg-visit
  >
    <TextField {...form.inputs.name} label="Name" />
    <ErrorMessages errors={form.errors} property={"name"} />
    <label>
      Private Chat?
      <Checkbox {...form.inputs.private} />
    </label>
    <SubmitButton {...form.inputs.submit} className={styles.buttonSubmit} />
  </Form>
);

export const NewUserForm = ({ form }) => (
  <Form
    {...form.form}
    extras={form.extras}
    className={styles.newUserForm}
    data-sg-visit
  >
    <TextField {...form.inputs.username} label="Username" />
    <ErrorMessages errors={form.errors} property={"username"} />
    <PasswordField {...form.inputs.password} label="Password" />
    <ErrorMessages errors={form.errors} property={"password"} />
    <PasswordField
      {...form.inputs.passwordConfirmation}
      label="Password Confirmation"
    />
    <ErrorMessages errors={form.errors} property={"password_confirmation"} />
    <SubmitButton {...form.inputs.submit} className={styles.buttonSubmit} />
  </Form>
);

export const RemoveContactForm = ({ form, userId }) => (
  <Form {...form.form} extras={form.extras} data-sg-visit>
    <input {...form.inputs.userId} value={userId} />
    <SubmitButton
      {...form.inputs.submit}
      className={layoutStyles.buttonDanger}
    />
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
    <SubmitButton
      {...form.inputs.submit}
      className={styles.headerUserActions}
    />
  </Form>
);

export const SignInForm = ({ form }) => (
  <Form
    {...form.form}
    extras={form.extras}
    className={styles.signInForm}
    data-sg-visit
  >
    <TextField {...form.inputs.username} label="Username" />
    <PasswordField {...form.inputs.password} label="Password" />
    <SubmitButton {...form.inputs.submit} className={styles.buttonSubmit} />
  </Form>
);

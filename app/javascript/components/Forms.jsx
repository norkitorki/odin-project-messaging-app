import React, { useEffect } from "react";
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
import { Delete, Logout } from "./Icons";

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

const FocusInvalidInput = ({ form, idPrefix }) => {
  useEffect(() => {
    if (form.errors) {
      const errorKey = Object.keys(form.errors)[0];
      document.getElementById(`${idPrefix}_${errorKey}`)?.focus();
    }
  }, [form.errors]);
};

const confirmSubmission = (message) => {
  return (event) => !confirm(message) && event.preventDefault();
};

export const AddContactForm = ({ form }) => (
  <Form {...form.form} extras={form.extras} data-sg-visit>
    <input type="hidden" name="pub_id" value={user.pub_id} />
    <SubmitButton {...form.inputs.submit} />
  </Form>
);

export const AvatarForm = ({ form }) => (
  <>
    <FocusInvalidInput form={form} idPrefix={"avatar"} />
    <Form
      {...form.form}
      extras={form.extras}
      className={styles.avatarForm}
      data-sg-visit
    >
      <input {...form.inputs.formAction} />
      <div>
        <FileField
          {...form.inputs.avatar}
          className={styles.imageSelector}
          label="Avatar (Max file size 1MB)"
        />
        <ErrorMessages errors={form.errors} property={"avatar"} />
      </div>
      <div>
        <PasswordField {...form.inputs.password} label="Current Password" />
        <ErrorMessages errors={form.errors} property={"password"} />
      </div>
      <div>
        <PasswordField
          {...form.inputs.passwordConfirmation}
          label="Confirm Password"
        />
        <ErrorMessages
          errors={form.errors}
          property={"password_confirmation"}
        />
      </div>

      <SubmitButton {...form.inputs.submit} className={styles.buttonSubmit} />
    </Form>
  </>
);

export const AddMessageForm = ({
  form,
  messageValue,
  parentId,
  onSubmit,
  replying = false,
}) => (
  <Form
    {...form.form}
    extras={form.extras}
    className={styles.messageForm}
    onSubmit={onSubmit}
    data-sg-visit
  >
    <input {...form.inputs.chatId} />
    {parentId && <input {...form.inputs.parentId} value={parentId} />}
    <TextArea
      {...form.inputs.value}
      id={replying ? "reply_value" : "new_value"}
      className={styles.messageInput}
      value={messageValue}
      label={`Add ${replying ? "Reply" : "Message"}`}
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
  <Form
    {...form.form}
    extras={form.extras}
    className={styles.chatRequestForm}
    data-sg-visit
  >
    <input {...form.inputs.chatId} />
    <input {...form.inputs.requestType} />
    <TextField
      {...form.inputs.receiver}
      placeholder="Username"
      label="Username"
      autoFocus
      required
    />
    <SubmitButton {...form.inputs.submit} className={styles.buttonSubmit} />
  </Form>
);

export const DeleteAvatarForm = ({ form }) => {
  const onSubmit = confirmSubmission(
    "You are about to delete your avatar. Are you sure?",
  );

  return (
    <Form {...form.form} extras={form.extras} onSubmit={onSubmit}>
      <SubmitButton
        {...form.inputs.submit}
        className={layoutStyles.buttonDanger}
      />
    </Form>
  );
};

export const DeleteChatForm = ({ form }) => {
  const onSubmit = confirmSubmission(
    "You are about to delete this chat. Are you sure?",
  );

  return (
    <Form {...form.form} extras={form.extras} onSubmit={onSubmit}>
      <input {...form.inputs.chatId} />
      <SubmitButton
        {...form.inputs.submit}
        className={layoutStyles.buttonDanger}
      />
    </Form>
  );
};

export const DeleteMessageForm = ({ form, messageId }) => {
  const onSubmit = confirmSubmission(
    "You are about to delete this message. Are you sure?",
  );

  return (
    <Form {...form.form} extras={form.extras} onSubmit={onSubmit}>
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
};

export const DeleteUserForm = ({ form }) => {
  const onSubmit = confirmSubmission(
    "Performing this action will delete your user account. Are you sure?",
  );

  return (
    <Form {...form.form} extras={form.extras} onSubmit={onSubmit}>
      <SubmitButton
        {...form.inputs.submit}
        className={styles.deleteUserButton}
      />
    </Form>
  );
};

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
        <TextArea
          {...form.inputs.value}
          className={styles.messageInput}
          label="Edit Message"
          defaultValue={message.value}
          autoFocus
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

export const EditPasswordForm = ({ form }) => (
  <>
    <FocusInvalidInput form={form} idPrefix={"user"} />
    <Form
      {...form.form}
      extras={form.extras}
      className={styles.editPasswordForm}
      data-sg-visit
    >
      <input {...form.inputs.formAction} />
      <div>
        <PasswordField {...form.inputs.password} label="New Password" />
        <ErrorMessages errors={form.errors} property={"password"} />
      </div>
      <div>
        <PasswordField
          {...form.inputs.passwordConfirmation}
          label="Confirm New Password"
        />
        <ErrorMessages
          errors={form.errors}
          property={"password_confirmation"}
        />
      </div>
      <div>
        <PasswordField
          {...form.inputs.currentPassword}
          label="Current Password"
        />
        <ErrorMessages errors={form.errors} property={"current_password"} />
      </div>
      <SubmitButton
        {...form.inputs.submit}
        className={layoutStyles.buttonInfo}
      />
    </Form>
  </>
);

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

export const LeaveChatForm = ({ form }) => {
  const onSubmit = confirmSubmission(
    "You are about to leave the chat. Are you sure?",
  );

  return (
    <Form {...form.form} extras={form.extras} onSubmit={onSubmit}>
      <input {...form.inputs.chatId} />
      <SubmitButton
        {...form.inputs.submit}
        className={layoutStyles.buttonDanger}
      />
    </Form>
  );
};

export const NewChatForm = ({ form }) => (
  <>
    <FocusInvalidInput form={form} idPrefix={"chat"} />
    <Form
      {...form.form}
      extras={form.extras}
      className={styles.newChatForm}
      data-sg-visit
    >
      <div>
        <TextField {...form.inputs.name} label="Name" />
        <ErrorMessages errors={form.errors} property={"name"} />
      </div>
      <label>
        Private Chat?
        <Checkbox {...form.inputs.private} />
      </label>
      <SubmitButton {...form.inputs.submit} className={styles.buttonSubmit} />
    </Form>
  </>
);

export const NewUserForm = ({ form }) => (
  <>
    <FocusInvalidInput form={form} idPrefix={"user"} />
    <Form
      {...form.form}
      extras={form.extras}
      className={styles.newUserForm}
      data-sg-visit
    >
      <div>
        <TextField {...form.inputs.username} label="Username" />
        <ErrorMessages errors={form.errors} property={"username"} />
      </div>
      <div>
        <FileField
          {...form.inputs.avatar}
          className={styles.imageSelector}
          label="Avatar (Max file size 1MB)"
        />
        <ErrorMessages errors={form.errors} property={"avatar"} />
      </div>
      <div>
        <PasswordField {...form.inputs.password} label="Password" />
        <ErrorMessages errors={form.errors} property={"password"} />
      </div>
      <div>
        <PasswordField
          {...form.inputs.passwordConfirmation}
          label="Password Confirmation"
        />
        <ErrorMessages
          errors={form.errors}
          property={"password_confirmation"}
        />
      </div>
      <SubmitButton {...form.inputs.submit} className={styles.buttonSubmit} />
    </Form>
  </>
);

export const RemoveContactForm = ({ form, userId }) => {
  const onSubmit = confirmSubmission(
    "Are you sure that you would like to remove this contact?",
  );

  return (
    <Form {...form.form} extras={form.extras} onSubmit={onSubmit}>
      <input {...form.inputs.userId} value={userId} />
      <SubmitButton
        {...form.inputs.submit}
        className={layoutStyles.buttonDanger}
      />
    </Form>
  );
};

export const RequestResponseForm = ({ form, accept = false }) => (
  <Form {...form.form} extras={form.extras} data-sg-visit>
    <input {...form.inputs.request} />
    <input {...form.inputs.requestType} />
    {accept && <input {...form.inputs.accept} />}
    <button
      type="submit"
      className={accept ? styles.buttonSubmit : layoutStyles.buttonDanger}
    >
      {accept ? "Accept" : "Decline"}
    </button>
  </Form>
);

export const SignOutForm = ({ form }) => (
  <Form {...form.form} extras={form.extras} data-sg-visit>
    <button type="submit" className={styles.signOutButton}>
      <Logout />
    </button>
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

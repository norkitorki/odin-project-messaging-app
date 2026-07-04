import React from "react";
import styles from "@stylesheets/User.module.css";
import { Layout } from "@javascript/components";
import { DeleteUserForm, EditPasswordForm } from "@javascript/components/Forms";
import { useContent } from "@thoughtbot/superglue";

export default function UsersEdit() {
  const { deleteUserForm, editPasswordForm } = useContent();

  return (
    <Layout>
      <h2>User Settings</h2>
      <div className={styles.badgeContainer}>
        <div className={styles.userBadge}>
          <h3>Change Password</h3>
          <EditPasswordForm form={editPasswordForm} />
        </div>
        <DeleteUserForm form={deleteUserForm} />
      </div>
    </Layout>
  );
}

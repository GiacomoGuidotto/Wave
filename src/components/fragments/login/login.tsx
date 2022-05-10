import React, { useState } from "react";
import { useTranslation } from "next-i18next";
import { SubmitHandler, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import styles from "./login.module.css";
import { updateUsername } from "../../../store/slices/user";
import { useRouter } from "next/router";

type Inputs = {
  username: string;
  password: string;
};

const Login: React.FC = () => {
  const { t } = useTranslation("login");
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Inputs>();
  const dispatch = useDispatch();
  const router = useRouter();

  const onSignUp: SubmitHandler<Inputs> = async (data) => {
    // call API

    dispatch(updateUsername(data.username));

    reset();

    await router.push("/home");
  };

  const [passwordShown, setPasswordShown] = useState(false);

  return (
    <div className={styles.loginBox}>
      <div className={styles.title}>{t("title")}</div>
      <form onSubmit={handleSubmit(onSignUp)} className={styles.form}>
        {/*Username field*/}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="username">
            {t("username")}
          </label>
          <input
            className={`${styles.input} ${
              errors.username && styles.errorInput
            }`}
            {...register("username", {
              required: {
                value: true,
                message: t("usernameRequired"),
              },
              minLength: {
                value: 5,
                message: t("usernameTooShort"),
              },
              maxLength: {
                value: 32,
                message: t("usernameTooLong"),
              },
              pattern: {
                value: /^[a-z\d_]*$/,
                message: t("usernameIncorrect"),
              },
            })}
            placeholder={t("username") + "..."}
          />
          {errors.username && (
            <div className={styles.error}>{errors.username.message}</div>
          )}
        </div>

        {/*Password field*/}
        <div className={styles.field}>
          <label className={styles.label} htmlFor="password">
            {t("password")}
            <button
              className={styles.showPassword}
              onClick={() => setPasswordShown(!passwordShown)}
            >
              {passwordShown ? t("hidePassword") : t("showPassword")}
            </button>
          </label>
          <input
            className={`${styles.input} ${
              errors.password && styles.errorInput
            }`}
            {...register("password", {
              required: {
                value: true,
                message: t("passwordRequired"),
              },
              minLength: {
                value: 5,
                message: t("passwordTooShort"),
              },
              maxLength: {
                value: 32,
                message: t("passwordTooLong"),
              },
              pattern: {
                value:
                  /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[^\w\d\s:])(\S){8,32}$/,
                message: t("passwordIncorrect"),
              },
            })}
            type={passwordShown ? "text" : "password"}
            placeholder={t("password") + "..."}
          />
          {errors.password && (
            <div className={styles.error}>{errors.password.message}</div>
          )}
        </div>

        <div className={styles.submit}>
          <button type="submit">{t("enter")}</button>
        </div>
      </form>
    </div>
  );
};

export default Login;

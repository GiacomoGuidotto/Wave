import styles from "./login.module.css";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { updateToken, updateUsername } from "store/slices/user";
import { login, logMessages } from "services/api_server";
import { ErrorResponse } from "models/error_response";

type Inputs = {
  username: string;
  password: string;
};

type Props = {
  onConnectionFail: () => void;
};

const Login: React.FC<Props> = ({ onConnectionFail }) => {
  const { t } = useTranslation("login");
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<Inputs>();

  const onSignUp: SubmitHandler<Inputs> = async (data) => {
    // call API
    const response = await login(data.username, data.password);

    if (response instanceof ErrorResponse) {
      onConnectionFail();
      return;
    }

    const payload = await response.json();

    // error cases
    switch (response.status) {
      case 400:
        logMessages(payload);
        return;

      case 404:
        setError(
          "username",
          {
            type: "elaboration",
            message: t("userNotFound"),
          },
          {
            shouldFocus: true,
          }
        );
        return;
    }

    const token: string = payload.token;

    // update store
    dispatch(updateToken(token));
    dispatch(updateUsername(data.username));

    // reset view and proceed home
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

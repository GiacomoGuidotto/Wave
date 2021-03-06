import styles from "./sign_up.module.css";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/router";
import Image from "next/image";
import { useTranslation } from "next-i18next";
import { useReduxSelector } from "store/hooks";
import {
  retrieveLanguage,
  retrievePicture,
  retrieveTheme,
  updateUser,
} from "store/slices/user";
import {
  changeUserInformation,
  login,
  logMessages,
  signUp,
} from "services/api_service";
import { ErrorResponse } from "models/error_response";

const getBase64 = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

type Inputs = {
  username: string;
  password: string;
  name: string;
  surname: string;
  picture: FileList;
  phone: string;
};

type Props = {
  onConnectionFail: () => void;
};

const SignUp: React.FC<Props> = ({ onConnectionFail }) => {
  const { t } = useTranslation("sign_up");
  const dispatch = useDispatch();
  const theme = useReduxSelector(retrieveTheme);
  const language = useReduxSelector(retrieveLanguage);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    getValues,
    setError,
  } = useForm<Inputs>();

  // change picture preview
  const [picture, setPicture] = useState(useReduxSelector(retrievePicture));
  useEffect(() => {
    const watcher = watch(async (value) => {
      const file = value.picture?.item(0);
      if (file) setPicture(await getBase64(file));
    });
    return () => watcher.unsubscribe();
  }, [watch]);

  const router = useRouter();
  const onSignUp: SubmitHandler<Inputs> = async (data) => {
    if (!confirmation) {
      setConfirmation(true);
    } else {
      // create account
      let response = await signUp(
        data.username,
        data.password,
        data.name,
        data.surname,
        picture,
        data.phone
      );

      if (response instanceof ErrorResponse) {
        onConnectionFail();
        return;
      }

      let payload = await response.json();

      // error cases
      switch (response.status) {
        case 400:
          logMessages(payload, "sign up");
          return;

        case 409:
          setError(
            "username",
            {
              type: "elaboration",
              message: t("alreadyExist"),
            },
            {
              shouldFocus: true,
            }
          );
          return;
      }

      // login the account
      response = await login(data.username, data.password);

      if (response instanceof ErrorResponse) {
        onConnectionFail();
        return;
      }

      payload = await response.json();

      // error cases
      switch (response.status) {
        case 400:
          logMessages(payload, "sign up");
          return;

        case 404:
          logMessages(payload, "sign up");
          return;
      }

      const token: string = payload.token;

      // change the theme and language
      response = await changeUserInformation({
        token: token,
        theme: theme,
        language: language,
      });

      if (response instanceof ErrorResponse) {
        onConnectionFail();
        return;
      }

      payload = await response.json();
      // error cases
      switch (response.status) {
        case 400:
          logMessages(payload, "change theme and language");
          return;

        case 401:
          logMessages(payload, "change theme and language");
          return;

        case 409:
          logMessages(payload, "change theme and language");
          return;
      }

      dispatch(
        updateUser({
          token: token,
          username: data.username,
          name: data.name,
          surname: data.surname,
          picture: picture,
          phone: data.phone,
          theme: theme,
          language: language,
        })
      );

      reset();

      await router.push("/home");

      setConfirmation(false);
    }
  };

  const [confirmation, setConfirmation] = useState(false);
  const [passwordShown, setPasswordShown] = useState(false);

  return (
    <div className={styles.signUpBox}>
      <div className={styles.title}>{t("title")}</div>
      <form onSubmit={handleSubmit(onSignUp)} className={styles.form}>
        <div className={styles.formRow}>
          {/*Username field*/}
          <div className={styles.formFirstColumn}>
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
          <div className={styles.formSecondColumn}>
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
        </div>

        <div className={styles.formRow}>
          {/*Name field*/}
          <div className={styles.formFirstColumn}>
            <label className={styles.label} htmlFor="name">
              {t("name")}
            </label>
            <input
              className={`${styles.input} ${errors.name && styles.errorInput}`}
              {...register("name", {
                required: {
                  value: true,
                  message: t("nameRequired"),
                },
                minLength: {
                  value: 1,
                  message: t("nameTooShort"),
                },
                maxLength: {
                  value: 64,
                  message: t("nameTooLong"),
                },
              })}
              placeholder={t("name") + "..."}
            />
            {errors.name && (
              <div className={styles.error}>{errors.name.message}</div>
            )}
          </div>

          {/*Surname field*/}
          <div className={styles.formSecondColumn}>
            <label className={styles.label} htmlFor="surname">
              {t("surname")}
            </label>
            <input
              className={`${styles.input} ${
                errors.surname && styles.errorInput
              }`}
              {...register("surname", {
                required: {
                  value: true,
                  message: t("surnameRequired"),
                },
                minLength: {
                  value: 1,
                  message: t("surnameTooShort"),
                },
                maxLength: {
                  value: 64,
                  message: t("surnameTooLong"),
                },
              })}
              placeholder={t("surname") + "..."}
            />
            {errors.surname && (
              <div className={styles.error}>{errors.surname.message}</div>
            )}
          </div>
        </div>

        {/*Picture field*/}
        <div className={styles.formRow}>
          <div className={styles.formFullRowColumn}>
            {picture && (
              <div className={styles.picture}>
                <Image src={picture} alt="Profile picture" layout="fill" />
              </div>
            )}
            <label className={styles.label} htmlFor="picture">
              {t("picture")}
            </label>
            <label className={styles.pictureInput} htmlFor="picture-upload">
              {picture
                ? getValues("picture")?.item(0)?.name ?? t("picture") + "..."
                : t("picture") + "..."}
            </label>
            <input
              className={`${styles.input} ${
                errors.picture && styles.errorInput
              }`}
              {...register("picture")}
              type="file"
              accept="image/png, image/jpeg"
              id="picture-upload"
            />
          </div>
        </div>

        {/*Phone field*/}
        <div className={styles.formRow}>
          <div className={styles.formFullRowColumn}>
            <label className={styles.label} htmlFor="phone">
              {t("phone")}
            </label>
            <input
              className={`${styles.input} ${errors.phone && styles.errorInput}`}
              {...register("phone", {
                minLength: {
                  value: 5,
                  message: t("phoneTooShort"),
                },
                maxLength: {
                  value: 19,
                  message: t("phoneTooLong"),
                },
                pattern: {
                  value: /^\d*$/,
                  message: t("phoneIncorrect"),
                },
              })}
              placeholder={t("phone") + "..."}
            />
            {errors.phone && (
              <div className={styles.error}>{errors.phone.message}</div>
            )}
          </div>
        </div>

        <div
          className={`${styles.submit} ${confirmation && styles.confirmation}`}
        >
          <button type="submit">
            {confirmation ? t("confirmation") : t("create")}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;

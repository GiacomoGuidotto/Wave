import styles from "./sign_up.module.css";
import {useTranslation} from "next-i18next";
import {SubmitHandler, useForm} from "react-hook-form";
import {useDispatch} from "react-redux";
import {retrieveLanguage, retrieveTheme, updateState} from "../../store/slices/user";
import {useReduxSelector} from "../../store/hooks";

const getBase64 = (file: File) => new Promise<string>((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result as string);
  reader.onerror = error => reject(error);
});

type Inputs = {
  username: string,
  name: string,
  surname: string,
  picture: FileList,
  phone: string,
}

const SignUp = () => {
  const {t} = useTranslation("sign_up")
  const {register, handleSubmit, formState: {errors}, reset} = useForm<Inputs>()
  const dispatch = useDispatch();
  const theme = useReduxSelector(retrieveTheme)
  const language = useReduxSelector(retrieveLanguage)

  const signUp: SubmitHandler<Inputs> = async (data) => {
    // picture conversion
    const file = data.picture.item(0);
    const picture = await getBase64(file!);

    // use API

    dispatch(updateState({
      token:    "",
      username: data.username,
      name:     data.name,
      surname:  data.surname,
      picture:  picture,
      phone:    data.phone,
      theme:    theme,
      language: language
    }))

    reset();
  }

  return (
    <div className={styles.startBox}>
      <div>{t("title")}</div>
      <form onSubmit={handleSubmit(signUp)} className={styles.form}>

        {/*Username field*/}
        <label className={styles.label} htmlFor="username">
          {t("username")}
        </label>
        <input
          className={styles.field} {
          ...register(
            "username",
            {
              required:  {
                value:   true,
                message: t("usernameRequired")
              },
              minLength: {
                value:   5,
                message: t("usernameTooShort")
              },
              maxLength: {
                value:   32,
                message: t("usernameTooLong")
              },
              pattern:   {
                value:   /^[a-z\d_]*$/,
                message: t("usernameIncorrect")
              }
            }
          )
        }/>
        {errors.username && <div className={styles.error}>{errors.username.message}</div>}

        {/*Name field*/}
        <label className={styles.label} htmlFor="name">
          {t("name")}
        </label>
        <input className={styles.field} {
          ...register(
            "name", {
              required:  {
                value:   true,
                message: t("nameRequired")
              },
              minLength: {
                value:   1,
                message: t("nameTooShort")
              },
              maxLength: {
                value:   64,
                message: t("nameTooLong")
              },
            }
          )
        }/>
        {errors.name && <div className={styles.error}>{errors.name.message}</div>}

        {/*Surname field*/}
        <label className={styles.label} htmlFor="surname">
          {t("surname")}
        </label>
        <input className={styles.field} {
          ...register(
            "surname", {
              required:  {
                value:   true,
                message: t("surnameRequired")
              },
              minLength: {
                value:   1,
                message: t("surnameTooShort")
              },
              maxLength: {
                value:   64,
                message: t("surnameTooLong")
              },
            }
          )
        }/>
        {errors.surname && <div className={styles.error}>{errors.surname.message}</div>}

        {/*Picture field*/}
        <label className={styles.label} htmlFor="picture">
          {t("picture")}
        </label>
        <input className={styles.field} {
          ...register("picture")
        } type="file" accept="image/png, image/jpeg"
        />

        {/*Phone field*/}
        <label className={styles.label} htmlFor="phone">
          {t("phone")}
        </label>
        <input className={styles.field} {
          ...register(
            "phone", {
              minLength: {
                value:   5,
                message: t("phoneTooShort")
              },
              maxLength: {
                value:   19,
                message: t("phoneTooLong")
              },
              pattern:   {
                value:   /^\d*$/,
                message: t("phoneIncorrect")
              }
            }
          )
        }/>
        {errors.phone && <div className={styles.error}>{errors.phone.message}</div>}

        <button className={styles.submit} type="submit">{t("create")}</button>
      </form>
    </div>
  )
}

export default SignUp

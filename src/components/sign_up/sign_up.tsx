import styles from "./sign_up.module.css";
import {useTranslation} from "next-i18next";

const SignUp = () => {
  const {t} = useTranslation("sign_up")

  return (
    <div className={styles.startBox}>
      <div>{t("title")}</div>
    </div>
  )
}

export default SignUp

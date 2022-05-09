import {Login, SignUp} from "../index";
import React, {useState} from "react";
import styles from "./access.module.css"
import {useTranslation} from "next-i18next";

type Props = {
  login?: boolean
}

const Access: React.FC<Props> = ({login = false}) => {
  const [showLogin, setShowLogin] = useState(login)
  const {t} = useTranslation("index");

  return (
    <div className={styles.accessBox}>
      <div
        className={`${styles.toggle} ${showLogin && styles.toggled}`}
        onClick={() => setShowLogin(!showLogin)}
      >
        <div>{!showLogin ? t("toggleLogin") : t("toggleSignUp")}</div>
      </div>
      <div className={`${styles.signUp} ${showLogin && styles.signUpHidden}`}><SignUp/></div>
      <div className={`${styles.login} ${!showLogin && styles.loginHidden}`}><Login/></div>
    </div>
  )
}

export default Access

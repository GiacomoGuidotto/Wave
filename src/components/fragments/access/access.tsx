import { Login, SignUp } from "../../index";
import React, { useEffect, useState } from "react";
import styles from "./access.module.css";
import { useTranslation } from "next-i18next";
import { testConnection } from "../../../lib/service/test_connection";

type Props = {
  login?: boolean;
  onConnectionFail: () => void;
};

const Access: React.FC<Props> = ({ login = false, onConnectionFail }) => {
  useEffect(() => {
    (async () => {
      const connection = await testConnection();
      if (!connection) onConnectionFail();
    })();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  const [rightPage, setRightPage] = useState(false);
  const { t } = useTranslation("access");

  return (
    <div className={styles.accessBox}>
      <div
        className={`${styles.leftPage} ${rightPage && styles.leftPageHidden}`}
      >
        {login ? <Login /> : <SignUp />}
      </div>
      <div
        className={`${styles.toggle} ${rightPage && styles.toggled}`}
        onClick={() => setRightPage(!rightPage)}
      >
        <div>
          {login
            ? rightPage
              ? t("backToLogin")
              : t("toggleSignUp")
            : rightPage
            ? t("backToSignUp")
            : t("toggleLogin")}
        </div>
      </div>
      <div
        className={`${styles.rightPage} ${
          !rightPage && styles.rightPageHidden
        }`}
      >
        {login ? <SignUp /> : <Login />}
      </div>
    </div>
  );
};

export default Access;

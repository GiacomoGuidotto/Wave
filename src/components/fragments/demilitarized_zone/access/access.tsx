import styles from "./access.module.css";
import React, { useEffect } from "react";
import { useTranslation } from "next-i18next";
import { test } from "services/api_service";
import { Login, SignUp } from "fragments";
import { useReduxSelector } from "store/hooks";
import {
  retrieveAccessRightPage,
  updateAccessRightPage,
} from "store/slices/wireframe";
import { useDispatch } from "react-redux";

type Props = {
  login?: boolean;
  onConnectionFail: () => void;
};

const Access: React.FC<Props> = ({ login = false, onConnectionFail }) => {
  useEffect(() => {
    (async () => {
      const connection = await test();
      if (!connection) onConnectionFail();
    })();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, []);

  const rightPage = useReduxSelector(retrieveAccessRightPage);
  const dispatch = useDispatch();
  const { t } = useTranslation("access");

  return (
    <div className={styles.accessBox}>
      <div
        className={`${styles.leftPage} ${rightPage && styles.leftPageHidden}`}
      >
        {login ? (
          <Login onConnectionFail={onConnectionFail} />
        ) : (
          <SignUp onConnectionFail={onConnectionFail} />
        )}
      </div>
      <div
        className={`${styles.toggle} ${rightPage && styles.toggled}`}
        onClick={() => dispatch(updateAccessRightPage(!rightPage))}
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
        {login ? (
          <SignUp onConnectionFail={onConnectionFail} />
        ) : (
          <Login onConnectionFail={onConnectionFail} />
        )}
      </div>
    </div>
  );
};

export default Access;

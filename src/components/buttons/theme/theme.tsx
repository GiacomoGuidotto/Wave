import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import styles from "./theme.module.css"
import {retrieveTheme, updateTheme} from "../../../store/slices/user";
import {useReduxSelector} from "../../../store/hooks";

type Props = {
  persistent: boolean
}

// https://www.freecodecamp.org/news/how-to-build-a-dark-mode-switcher-with-tailwind-css-and-flowbite/
const ThemeButton: React.FC<Props> = ({persistent}) => {
  const storeTheme = useReduxSelector(retrieveTheme)


  useEffect(() => {
    const darkIcon = document.getElementById('theme-toggle-dark-icon')!;
    const lightIcon = document.getElementById('theme-toggle-light-icon')!;

    if (storeTheme === "D" && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add("dark")
      lightIcon.classList.add("hidden")
    } else {
      document.documentElement.classList.remove("dark")
      darkIcon.classList.add("hidden")
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // change language
  const dispatch = useDispatch()
  const onChange = () => {
    const darkIcon = document.getElementById('theme-toggle-dark-icon')!;
    const lightIcon = document.getElementById('theme-toggle-light-icon')!;

    darkIcon.classList.toggle('hidden');
    lightIcon.classList.toggle('hidden');

    // TODO fix bug: dark theme rendering by tailwind
    if (storeTheme === "L") {
      document.documentElement.classList.add("dark")
      dispatch(updateTheme("D"))
    } else if (storeTheme === "D") {
      document.documentElement.classList.remove("dark")
      dispatch(updateTheme("L"))

    }

    if (persistent) {
      // call API, for MZ usage
    }
  }

  return (
    <button
      id="theme-toggle"
      type="button"
      className={styles.themeButton}
      onClick={onChange}
    >
      <svg
        id="theme-toggle-dark-icon"
        className={`${styles.icon}`}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
        />
      </svg>
      <svg
        id="theme-toggle-light-icon"
        className={styles.icon}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
          fillRule="evenodd"
          clipRule="evenodd"
        />
      </svg>
    </button>
  )
}

export default ThemeButton

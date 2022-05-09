// noinspection JSIgnoredPromiseFromCall

import React, {useContext} from "react";
import {GlobalsContext} from "../../../lib/global_consts";
import {useDispatch} from "react-redux";
import Select, {ActionMeta, MultiValue, SingleValue} from "react-select";
import {retrieveLanguage, updateLanguage} from "../../../store/slices/user";
import {useTranslation} from "react-i18next";
import {useReduxSelector} from "../../../store/hooks";

type Props = {
  persistent: boolean
}

type SelectOption = {
  label: string,
  value: string
}

const LanguageButton: React.FC<Props> = ({persistent}) => {
  const languages = useContext(GlobalsContext).languages
  const languagesOptions = languages.map<SelectOption>(({name, value}) => ({
    label: name,
    value: value
  }))
  const storeLanguage = useReduxSelector(retrieveLanguage);

  // change language
  const {i18n} = useTranslation();
  const dispatch = useDispatch()
  const onChange = (newValue: SingleValue<SelectOption> | MultiValue<SelectOption>, _: ActionMeta<SelectOption>) => {
    if (!isSingleValue(newValue)) return;

    const newLanguage = newValue!.value
    dispatch(updateLanguage(newLanguage))
    i18n.changeLanguage(newLanguage.toLowerCase())
    // TODO fix bug: functionality of changeLanguage on default locale

    if (persistent) {
      // call API
    }
  }

  const isSingleValue = (newValue: any): newValue is SingleValue<SelectOption> => newValue !==
                                                                                  undefined

  return (
    <Select
      id="languages"
      instanceId="languages"
      options={languagesOptions}
      defaultValue={languagesOptions.find(value => value.value === storeLanguage)}
      onChange={onChange}
    />
  )
}

export default LanguageButton

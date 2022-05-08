import React, {useContext} from "react";
import {GlobalsContext} from "../../../lib/global_consts";
import {useDispatch} from "react-redux";
import Select, {ActionMeta, SingleValue} from "react-select";
import {updateLanguage} from "../../../store/slices/user";

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

  // change language
  const dispatch = useDispatch()
  const onChange = (newLanguage: SingleValue<SelectOption>, _: ActionMeta<SelectOption>) => {
    dispatch(updateLanguage(newLanguage!.value))

    if (persistent) {
      // call API
    }
  }

  return (
    <Select
      id="languages"
      instanceId="languages"
      options={languagesOptions}
      defaultValue={languagesOptions[0]}
      onChange={onChange}
    />
  )
}

export default LanguageButton

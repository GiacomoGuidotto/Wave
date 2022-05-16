import React, { useContext } from "react";
import { useDispatch } from "react-redux";
import Select, { MultiValue, SingleValue } from "react-select";
import { useRouter } from "next/router";
import { GlobalsContext } from "globals/global_consts";
import { useReduxSelector } from "store/hooks";
import { retrieveLanguage, updateLanguage } from "store/slices/user";

type Props = {
  persistent: boolean;
};

type SelectOption = {
  label: string;
  value: string;
};

const LanguageButton: React.FC<Props> = ({ persistent }) => {
  const languages = useContext(GlobalsContext).languages;
  const languagesOptions = languages.map<SelectOption>(({ name, value }) => ({
    label: name,
    value: value,
  }));
  const storeLanguage = useReduxSelector(retrieveLanguage);

  // change language
  const router = useRouter();
  const dispatch = useDispatch();
  const onChange = (
    newValue: SingleValue<SelectOption> | MultiValue<SelectOption>
  ) => {
    if (!isSingleValue(newValue)) return;

    const newLanguage = newValue?.value ?? "EN";
    dispatch(updateLanguage(newLanguage));

    if (persistent) {
      // call API
    }

    // noinspection JSIgnoredPromiseFromCall
    router.push(router.pathname, router.pathname, {
      locale: newLanguage.toLowerCase(),
      scroll: false,
    });
  };

  const isSingleValue = (
    newValue: SingleValue<SelectOption> | MultiValue<SelectOption>
  ): newValue is SingleValue<SelectOption> => newValue !== undefined;

  return (
    <Select
      id="languages"
      instanceId="languages"
      options={languagesOptions}
      defaultValue={languagesOptions.find(
        (value) => value.value === storeLanguage
      )}
      onChange={onChange}
    />
  );
};

export default LanguageButton;

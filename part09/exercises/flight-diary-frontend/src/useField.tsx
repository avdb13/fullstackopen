import { HTMLInputTypeAttribute, useState } from "react";

interface Field {
  type: HTMLInputTypeAttribute,
  value: string,
  onChange: (event: React.SyntheticEvent) => void,
}

const useField = (type: HTMLInputTypeAttribute): [Field, () => boolean] => {
  const [value, setValue] = useState<string>("");

  const onChange = (event: React.SyntheticEvent) => {
    setValue((event.target as HTMLInputElement).value);
  };

  const reset = (): boolean => {
    setValue("");
    return true
  };

  return [
    {
      type,
      value,
      onChange,
    },
    reset,
  ];
};

export default useField;

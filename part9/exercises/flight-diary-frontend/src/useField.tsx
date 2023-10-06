import { HTMLInputTypeAttribute, useState } from "react"

const useField = (type: HTMLInputTypeAttribute) => {
  const [value, setValue] = useState<string>('')

  const onChange = (event: React.SyntheticEvent) => {
    setValue((event.target as HTMLInputElement).value)
  }

  return {
    type,
    value,
    onChange,
  }
}

export default useField

import React, { useState } from 'react'
import { CustomInput, FakeInput, FakePlaceholder } from './styles'
interface InputProps {
  title: string
  value: string
  onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void
}
const Input: React.FC<InputProps> = ({ title, value, onChange }) => {
  const [activateAnimation, setActivateAnimation] = useState(false)
  const [deactivateAnimation, setDeactivateAnimation] = useState(false)
  return (
    <FakeInput hasValue={!!value || deactivateAnimation}>
      <FakePlaceholder hasValue={!!value || activateAnimation}>
        {title}
      </FakePlaceholder>
      <CustomInput
        value={value}
        onChange={evt => {
          const { value } = evt.target
          setDeactivateAnimation(value === '')
          onChange(evt)
        }}
        onFocus={() => setActivateAnimation(true)}
        onBlur={() => {
          setDeactivateAnimation(!!value)
          setActivateAnimation(!!value)
        }}
      />
    </FakeInput>
  )
}
export default Input

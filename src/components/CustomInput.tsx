/* eslint-disable @typescript-eslint/no-explicit-any */
import { Controller } from 'react-hook-form'

import { Form, Input } from 'antd'

type CustomInputProps = {
  name: string
  control?: any
  errors?: any
  label?: string
  placeholder: string
  size: 'large' | 'middle' | 'small'
  className?: string
  type?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  prefixIcon?: JSX.Element
}

export const CustomInput: React.FC<CustomInputProps> = ({
  name,
  control,
  errors,
  label,
  placeholder,
  size = 'small',
  className,
  prefixIcon = null,
  type = 'text',
  onChange,
  onKeyDown
}) => {
  return control ? (
    <Form.Item
      label={<span className='text-lg font-normal'>{label}</span>}
      className='mb-0 border-0 mt-4 text-lg font-normal'
      validateStatus={errors[name] ? 'error' : ''}
      help={errors[name]?.message}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          return type === 'text' ? (
            <Input
              {...field}
              size={size}
              placeholder={placeholder}
              prefix={prefixIcon}
              className={`text-lg font-medium border-1 border-gray-200 rounded-md hover:border-primary-800 focus-within:!border-primary-800 focus-within:!shadow-custom px-4 py-[9px] ${className}`}
            />
          ) : (
            <Input.Password
              {...field}
              size={size}
              placeholder={placeholder}
              prefix={prefixIcon}
              className={`text-lg font-medium border-1 border-gray-200 rounded-md hover:border-primary-800 focus-within:!border-primary-800 focus-within:!shadow-custom px-4 py-[9px] ${className}`}
            />
          )
        }}
      />
    </Form.Item>
  ) : (
    <Input
      name={name}
      size={size}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      className={`text-lg font-medium mr-2 border-1 border-gray-200 rounded-md hover:border-primary-800 focus-within:!border-primary-800 focus-within:!shadow-custom ${className}`}
    />
  )
}

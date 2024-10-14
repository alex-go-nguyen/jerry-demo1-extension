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
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void; 
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
  onChange,
}) => {
  return control ? (
    <Form.Item
      label={<span className='text-lg font-medium'>{label}</span>}
      className='mb-0 mt-4 text-lg font-medium'
      hasFeedback
      validateStatus={errors[name] ? 'error' : ''}
      help={errors[name]?.message}
    >
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            size={size}
            placeholder={placeholder}
            prefix={prefixIcon}
            className={`text-lg font-medium border-1 border-gray-200 rounded-md hover:border-primary-800 focus-within:shadow-custom ${className}`}
          />
        )}
      />
    </Form.Item>
  ) : (
    <Input
      name={name}
      size={size}
      onChange={onChange}
      placeholder={placeholder}
      className={`text-lg font-medium mr-2 border-1 border-gray-200 rounded-md hover:border-primary-800 focus-within:shadow-custom ${className}`}
    />
  )
}

'use client'

import { useId } from 'react'
import LuxInput from '@/components/checkout/LuxInput'

export type StepInfoData = {
  email: string
  firstName: string
  lastName: string
  address1: string
  address2: string
  city: string
  state: string
  postcode: string
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra & Nagar Haveli and Daman & Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
]

type StepInfoProps = {
  data: StepInfoData
  errors: Partial<Record<keyof StepInfoData, string>>
  onChange: <K extends keyof StepInfoData>(field: K, value: StepInfoData[K]) => void
}

export default function StepInfo({ data, errors, onChange }: StepInfoProps) {
  const stateListId = useId()

  return (
    <div className="space-y-5">
      <LuxInput
        label="Email"
        type="email"
        name="email"
        autoComplete="email"
        value={data.email}
        onChange={(e) => onChange('email', e.target.value)}
        error={errors.email}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <LuxInput
          label="First name"
          name="firstName"
          autoComplete="given-name"
          value={data.firstName}
          onChange={(e) => onChange('firstName', e.target.value)}
          error={errors.firstName}
        />
        <LuxInput
          label="Last name"
          name="lastName"
          autoComplete="family-name"
          value={data.lastName}
          onChange={(e) => onChange('lastName', e.target.value)}
          error={errors.lastName}
        />
      </div>
      <LuxInput
        label="Address line 1"
        name="address1"
        autoComplete="address-line1"
        value={data.address1}
        onChange={(e) => onChange('address1', e.target.value)}
        error={errors.address1}
      />
      <LuxInput
        label="Address line 2 (optional)"
        name="address2"
        autoComplete="address-line2"
        value={data.address2}
        onChange={(e) => onChange('address2', e.target.value)}
        error={errors.address2}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <LuxInput
          label="City"
          name="city"
          autoComplete="address-level2"
          value={data.city}
          onChange={(e) => onChange('city', e.target.value)}
          error={errors.city}
        />
        <LuxInput
          label="Postcode"
          name="postcode"
          autoComplete="postal-code"
          inputMode="numeric"
          maxLength={6}
          value={data.postcode}
          onChange={(e) => onChange('postcode', e.target.value)}
          error={errors.postcode}
        />
      </div>
      <div>
        <LuxInput
          label="State"
          name="state"
          autoComplete="address-level1"
          list={stateListId}
          value={data.state}
          onChange={(e) => onChange('state', e.target.value)}
          error={errors.state}
        />
        <datalist id={stateListId}>
          {INDIAN_STATES.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      </div>
    </div>
  )
}

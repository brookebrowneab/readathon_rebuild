import React from 'react';
import FormField from '../ui/form-field';
import Input from '../ui/input';

export interface CardFormValues {
  cardName: string;
  cardNumber: string;
  expiryDate: string;
  cvc: string;
  zipCode: string;
}

interface SquareCardFormProps {
  value: CardFormValues;
  onChange: (next: CardFormValues) => void;
}

const formatCardNumber = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ');
};

const formatExpiry = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) {
    return digits;
  }
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

export default function SquareCardForm({ value, onChange }: SquareCardFormProps) {
  return (
    <div className="space-y-4">
      <FormField label="Cardholder Name" htmlFor="cardName" required>
        <Input
          id="cardName"
          value={value.cardName}
          onChange={(event) => onChange({ ...value, cardName: event.target.value })}
          placeholder="Full Name"
        />
      </FormField>
      <FormField label="Card Number" htmlFor="cardNumber" required>
        <Input
          id="cardNumber"
          inputMode="numeric"
          value={value.cardNumber}
          onChange={(event) =>
            onChange({ ...value, cardNumber: formatCardNumber(event.target.value) })
          }
          placeholder="1234 5678 9012 3456"
        />
      </FormField>
      <div className="grid gap-4 md:grid-cols-3">
        <FormField label="Expiry" htmlFor="expiryDate" required>
          <Input
            id="expiryDate"
            inputMode="numeric"
            value={value.expiryDate}
            onChange={(event) =>
              onChange({ ...value, expiryDate: formatExpiry(event.target.value) })
            }
            placeholder="MM/YY"
          />
        </FormField>
        <FormField label="CVC" htmlFor="cvc" required>
          <Input
            id="cvc"
            inputMode="numeric"
            value={value.cvc}
            onChange={(event) =>
              onChange({ ...value, cvc: event.target.value.replace(/\D/g, '').slice(0, 4) })
            }
            placeholder="123"
          />
        </FormField>
        <FormField label="ZIP" htmlFor="zipCode" required>
          <Input
            id="zipCode"
            inputMode="numeric"
            value={value.zipCode}
            onChange={(event) =>
              onChange({ ...value, zipCode: event.target.value.replace(/\D/g, '').slice(0, 5) })
            }
            placeholder="12345"
          />
        </FormField>
      </div>
    </div>
  );
}

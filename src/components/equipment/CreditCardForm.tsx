import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard } from "lucide-react";

interface CreditCardFormProps {
  onValidChange: (isValid: boolean) => void;
}

export function CreditCardForm({ onValidChange }: CreditCardFormProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.length <= 19) {
      setCardNumber(formatted);
      checkValidity(formatted, cardName, expiry, cvv);
    }
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value.replace("/", ""));
    if (formatted.length <= 5) {
      setExpiry(formatted);
      checkValidity(cardNumber, cardName, formatted, cvv);
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/[^0-9]/gi, "");
    if (v.length <= 4) {
      setCvv(v);
      checkValidity(cardNumber, cardName, expiry, v);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardName(e.target.value);
    checkValidity(cardNumber, e.target.value, expiry, cvv);
  };

  const checkValidity = (num: string, name: string, exp: string, cv: string) => {
    const isValid =
      num.replace(/\s/g, "").length >= 16 &&
      name.trim().length >= 3 &&
      exp.length === 5 &&
      cv.length >= 3;
    onValidChange(isValid);
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
        <CreditCard className="h-4 w-4" />
        Payment Information
      </div>

      <div className="space-y-2">
        <Label htmlFor="cardNumber">Card Number</Label>
        <Input
          id="cardNumber"
          placeholder="1234 5678 9012 3456"
          value={cardNumber}
          onChange={handleCardNumberChange}
          className="font-mono"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cardName">Cardholder Name</Label>
        <Input
          id="cardName"
          placeholder="JOHN DOE"
          value={cardName}
          onChange={handleNameChange}
          className="uppercase"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiry">Expiry Date</Label>
          <Input
            id="expiry"
            placeholder="MM/YY"
            value={expiry}
            onChange={handleExpiryChange}
            className="font-mono"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cvv">CVV</Label>
          <Input
            id="cvv"
            type="password"
            placeholder="•••"
            value={cvv}
            onChange={handleCvvChange}
            className="font-mono"
          />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Your payment information is securely processed.
      </p>
    </div>
  );
}

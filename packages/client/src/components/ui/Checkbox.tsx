import { type InputHTMLAttributes, forwardRef } from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = '', label, id, ...props }, ref) => {
    const checkboxId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <label
        htmlFor={checkboxId}
        className={`inline-flex items-center gap-3 cursor-pointer ${className}`}
      >
        <div className="relative">
          <input
            ref={ref}
            id={checkboxId}
            type="checkbox"
            className="peer sr-only"
            {...props}
          />
          <div className="
            w-6 h-6 border-2 border-black rounded bg-white 
            transition-all duration-200
            peer-checked:bg-[#4FC3F7]
            peer-focus:shadow-[3px_3px_0px_#4FC3F7]
            peer-disabled:bg-gray-100 peer-disabled:cursor-not-allowed
          ">
            <Check className="
              w-full h-full p-0.5 text-black
              opacity-0 peer-checked:opacity-100
              transition-opacity duration-200
            " />
          </div>
        </div>
        {label && (
          <span className="text-base text-gray-700 select-none">{label}</span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = 'Checkbox';


import { InputHTMLAttributes } from "react";

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
}

export function InputField({
  id,
  label,
  type = "text",
  placeholder,
  ...props
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm font-medium tracking-wide">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-4 py-3 
                   focus:outline-none focus:ring-2 focus:ring-white/40"
        {...props}
      />
    </div>
  );
}

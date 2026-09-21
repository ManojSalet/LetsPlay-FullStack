import React from "react";

function Button({
  type = "button",
  label,
  children,
  className = "",
  variant = "primary",
  size = "md",
  icon: Icon,
  onClick,
  disabled = false,
  ...rest
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer gap-2";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variantStyles = {
    primary:
      "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow focus:ring-indigo-500",
    secondary:
      "bg-slate-800 hover:bg-slate-900 text-white shadow-sm hover:shadow focus:ring-slate-700",
    outline:
      "border border-slate-300 hover:bg-slate-100 text-slate-700 focus:ring-slate-400 bg-white",
    danger:
      "bg-rose-600 hover:bg-rose-700 text-white shadow-sm focus:ring-rose-500",
    ghost:
      "text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:ring-slate-300",
  };

  const selectedSize = typeof size === "string" ? sizeStyles[size] || sizeStyles.md : "";
  const selectedVariant = variantStyles[variant] || variantStyles.primary;

  return (
    <button
      type={type}
      className={`${baseStyles} ${selectedSize} ${selectedVariant} ${className}`}
      onClick={onClick}
      disabled={disabled}
      {...rest}
    >
      {Icon && (typeof Icon === "function" || typeof Icon === "object" ? <Icon className="w-4 h-4" /> : Icon)}
      {label || children}
    </button>
  );
}

export default Button;

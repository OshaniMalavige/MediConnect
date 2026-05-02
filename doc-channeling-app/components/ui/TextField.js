export default function TextField({
                                      label,
                                      type = 'text',
                                      value,
                                      onChange,
                                      placeholder,
                                      required = false,
                                      error,
                                      hint
                                  }) {
    return (
        <div className="space-y-1">
            <label className="text-sm font-medium text-emerald-900">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
            </label>

            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className={`w-full px-4 py-2.5 rounded-lg border text-sm transition-all focus:outline-none focus:ring-2
          ${error
                    ? 'border-red-500 focus:ring-red-400'
                    : 'border-emerald-200 focus:ring-emerald-500'
                }`
                }
            />

            {hint && !error && (
                <p className="text-xs text-emerald-600">{hint}</p>
            )}

            {error && (
                <p className="text-xs text-red-500">{error}</p>
            )}
        </div>
    )
}
export default function Button({
                                   children,
                                   onClick,
                                   type = 'button',
                                   variant = 'primary',
                                   className = '',
                                   disabled = false,
                                   loading = false
                               }) {
    const baseStyles =
        'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
        primary: 'bg-teal-600 hover:bg-teal-700 text-white focus:ring-teal-500',
        secondary: 'bg-teal-100 hover:bg-teal-200 text-teal-800 focus:ring-teal-400',
        danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
    }

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={`${baseStyles} ${variants[variant]} ${className}`}
        >
            {loading && (
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            <span>{children}</span>
        </button>
    )
}
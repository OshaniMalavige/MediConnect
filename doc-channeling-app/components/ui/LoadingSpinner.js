export default function LoadingSpinner({ size = 16 }) {
    return (
        <div
            className="animate-spin rounded-full border-2 border-emerald-600 border-t-transparent"
            style={{ width: size, height: size }}
        />
    )
}
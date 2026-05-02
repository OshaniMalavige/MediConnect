export default function Table({ headers, data, renderRow }) {
    return (
        <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
            <table className="min-w-full text-sm">
                <thead className="bg-emerald-600 text-white">
                <tr>
                    {headers.map((header, idx) => (
                        <th key={idx} className="px-6 py-3 text-left font-medium">
                            {header}
                        </th>
                    ))}
                </tr>
                </thead>
                <tbody className="divide-y divide-emerald-100">
                {data.map((item, idx) => renderRow(item, idx))}
                </tbody>
            </table>
        </div>
    )
}
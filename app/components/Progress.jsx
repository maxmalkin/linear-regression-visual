import React from 'react';

export default function ProgressBar({ value, max }) {
	const percentage = Math.min((value / max) * 100, 100);

	return (
		<div className="w-full h-4 bg-transparent rounded-md overflow-hidden">
			<div
				className="h-full bg-blue-600 transition-all duration-300 ease-in-out"
				style={{ width: `${percentage}%` }}
			></div>
		</div>
	);
}

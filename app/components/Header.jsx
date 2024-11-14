'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function Header({ secondBtnText }) {
	const router = useRouter();

	return (
		<div className="flex justify-between items-center px-8 py-4 bg-white/10 backdrop-blur-md shadow-lg text-white border border-white/20">
			<h1
				className="text-xl font-black cursor-pointer"
				onClick={() => router.push('/')}
			>
				Regression Visualizer
			</h1>
			<div className="flex gap-4">
				<button
					onClick={() => router.push('/')}
					className="px-4 py-2 bg-blue-500/80 rounded-md hover:bg-blue-700/80 transition duration-200 shadow-md"
				>
					Home
				</button>

				<button
					onClick={() => router.push(`/visuals/${secondBtnText.toLowerCase()}`)}
					className="px-4 py-2 bg-green-500/80 rounded-md hover:bg-green-700/80 transition duration-200 shadow-md"
				>
					{secondBtnText}
				</button>
			</div>
		</div>
	);
}

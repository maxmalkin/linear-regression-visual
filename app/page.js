'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
	const router = useRouter();

	return (
		<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black">
			<div className="w-4/5 max-w-4xl p-8 bg-white/10 backdrop-blur-md rounded-xl shadow-lg text-center border border-white/20">
				<h1 className="text-5xl font-extrabold text-white mb-6">
					Welcome to the Regression Visualizer
				</h1>
				<p className="text-lg text-gray-300 mb-8">
					Explore visualizations for linear and polynomial regression models.
				</p>

				<div className="flex justify-center gap-6">
					<button
						onClick={() => router.push('/visuals/linear')}
						className="px-6 py-3 bg-blue-500/80 hover:bg-blue-700/90 active:bg-blue-800/90 text-white text-lg font-bold rounded-lg shadow-lg transition duration-200"
					>
						Linear Regression
					</button>

					<button
						onClick={() => router.push('/visuals/polynomial')}
						className="px-6 py-3 bg-green-500/80 hover:bg-green-700/90 active:bg-green-800/90 text-white text-lg font-bold rounded-lg shadow-lg transition duration-200"
					>
						Polynomial Regression
					</button>
				</div>
			</div>
		</div>
	);
}

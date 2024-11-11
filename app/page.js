'use client';
import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import { createData } from '../model/model';

export default function Home() {
	const [data, setData] = useState(null);

	const handleUseSampleData = () => {
		const sampleData = createData();
		setData(sampleData);
	};

	return (
		<div className="grid grid-rows-[20px_1fr_20px] min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			<div className="flex justify-between items-center">
				<p className="text-4xl font-black">Linear Regression Visualizer</p>
				<div
					className="hover:cursor-pointer hover:bg-indigo-800 active:bg-indigo-900 bg-indigo-700 rounded-full shadow-sm shadow-indigo-300 p-3 font-bold"
					onClick={() => console.log('Settings clicked')}
				>
					Settings
				</div>
			</div>
			<div className="flex flex-col items-center gap-4">
				<div className="w-full h-96">
					{data ? (
						<Plot
							data={[
								{
									x: data.x.arraySync(),
									y: data.y.arraySync(),
									mode: 'markers',
									type: 'scatter',
									marker: { color: '#39ff14' },
								},
							]}
							layout={{
								title: {
									text: 'Sample Data',
									font: {
										color: 'white',
									},
								},
								xaxis: {
									title: {
										text: 'X',
										font: {
											color: 'white',
										},
									},
									tickfont: {
										color: 'white',
									},
								},
								yaxis: {
									title: {
										text: 'Y',
										font: {
											color: 'white',
										},
									},
									tickfont: {
										color: 'white',
									},
								},
								plot_bgcolor: '#0a0a0a',
								paper_bgcolor: '#0a0a0a',
								autosize: true,
							}}
							style={{
								width: '100%',
								height: '100%',
							}}
						/>
					) : (
						<div className="flex items-center justify-center h-full text-gray-500">
							Data will appear here.
						</div>
					)}
				</div>
				<button
					className="px-4 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 active:bg-blue-800 shadow-sm"
					onClick={handleUseSampleData}
				>
					{data ? 'Generate New Sample' : 'Generate Sample Data'}
				</button>
			</div>
		</div>
	);
}

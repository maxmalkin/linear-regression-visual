'use client';

import React, { useState } from 'react';
import { createModel, createData } from '@/models/linear';
import ProgressBar from '@/app/components/Progress';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

import dynamic from 'next/dynamic';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function Home() {
	const [data, setData] = useState(null);
	const [trainingResults, setTrainingResults] = useState({
		loss: null,
		lineOfBestFit: { x: [], y: [] },
	});
	const [model, setModel] = useState(createModel());
	const [isTraining, setIsTraining] = useState(false);
	const [epochProgress, setEpochProgress] = useState(0);

	const handleTrainModel = async () => {
		const sampleData = createData();
		setData({
			x: sampleData.x.arraySync(),
			y: sampleData.y.arraySync(),
		});

		setIsTraining(true);
		const totalEpochs = 200;

		await model.fit(sampleData.x.expandDims(1), sampleData.y.expandDims(1), {
			epochs: totalEpochs,
			callbacks: {
				onEpochEnd: async (epoch, logs) => {
					const weights = model.getWeights();
					const slope = (await weights[0].data())[0];
					const bias = (await weights[1].data())[0];
					const xFit = sampleData.x.arraySync();
					const yFit = xFit.map((x) => slope * x + bias);
					setTrainingResults({
						loss: logs.loss,
						lineOfBestFit: { x: xFit, y: yFit },
					});
					setEpochProgress(epoch + 1);
				},
			},
		});

		setIsTraining(false);
		setEpochProgress(0);
	};

	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white">
			<Header secondBtnText={'Polynomial'} />
			<div className="flex-grow p-8 flex justify-center items-center">
				<div className="w-full max-w-4xl p-8 bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20">
					<div className="flex flex-col gap-4">
						<div>
							<p className="text-4xl font-black mb-2">
								Linear Regression Visualizer
							</p>
							<p className="text-gray-300">
								This is a simple linear regression model visualizer. It allows
								you to generate a line of best fit and visualize the data points
								and the line of best fit over each epoch of training.
							</p>
						</div>

						<div className="flex flex-col items-center gap-4 mt-4">
							<div className="w-full h-96">
								{data ? (
									<Plot
										data={[
											{
												x: data.x,
												y: data.y,
												mode: 'markers',
												type: 'scatter',
												marker: { color: '#39ff14' },
												name: 'Data Points',
											},
											{
												x: trainingResults.lineOfBestFit.x,
												y: trainingResults.lineOfBestFit.y,
												mode: 'lines',
												type: 'scatter',
												line: { color: '#00bfff', width: 3 },
												name: 'Line of Best Fit',
											},
										]}
										layout={{
											title: {
												text: 'Sample Data',
												font: {
													color: '#d1d5db',
												},
											},
											xaxis: {
												title: {
													text: 'X',
													font: {
														color: '#d1d5db',
													},
												},
												tickfont: {
													color: '#d1d5db',
												},
											},
											yaxis: {
												title: {
													text: 'Y',
													font: {
														color: '#d1d5db',
													},
												},
												tickfont: {
													color: '#d1d5db',
												},
											},
											plot_bgcolor: '#00000000',
											paper_bgcolor: '#00000000',
											autosize: true,
										}}
										style={{
											width: '100%',
											height: '100%',
										}}
									/>
								) : (
									<div className="flex items-center justify-center h-full text-gray-300 border-gray-500 border-dashed border-small">
										Data will appear here.
									</div>
								)}
							</div>
							{isTraining ? (
								<ProgressBar value={epochProgress} max={150} />
							) : (
								<button
									className="px-4 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 active:bg-blue-800 shadow-sm"
									onClick={handleTrainModel}
								>
									{data ? 'Train New Model' : 'Generate and Train Model'}
								</button>
							)}
							{trainingResults.loss !== null && (
								<div className="text-gray-300">
									<p>
										<strong>Epoch:</strong> {epochProgress.toFixed(0)}
									</p>
									<p>
										<strong>Current Loss: </strong>
										{trainingResults.loss.toFixed(6)}
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</div>
	);
}

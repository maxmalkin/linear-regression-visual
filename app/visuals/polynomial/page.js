'use client';
import React, { useState } from 'react';
import { createModel, createData } from '@/models/polynomial';
import ProgressBar from '@/app/components/Progress';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';

import dynamic from 'next/dynamic';
import Slider from '@mui/material/Slider';
import Tooltip from '@mui/material/Tooltip';

const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export default function PolynomialVisualizer() {
	const [data, setData] = useState(null);
	const [trainingResults, setTrainingResults] = useState({
		loss: null,
		curveOfBestFit: { x: [], y: [] },
	});
	const [model, setModel] = useState(null);
	const [isTraining, setIsTraining] = useState(false);
	const [epochProgress, setEpochProgress] = useState(0);
	const [degree, setDegree] = useState(3);
	const [dataPoints, setDataPoints] = useState(10);

	const handleTrainModel = async () => {
		try {
			console.log('Degree:', degree);
			console.log('Data Points:', dataPoints);

			const sampleData = createData(degree, dataPoints);
			setData({
				x: sampleData.x.arraySync(),
				y: sampleData.y.arraySync(),
			});

			const newModel = createModel(degree);
			setModel(newModel);

			setIsTraining(true);
			const totalEpochs = 200;

			await newModel.fit(sampleData.x, sampleData.y.expandDims(1), {
				epochs: totalEpochs,
				callbacks: {
					onEpochEnd: async (epoch, logs) => {
						try {
							const weights = await Promise.all(
								newModel.getWeights().map(async (w) => await w.data())
							);
							const coefficients = weights[0];
							const bias = weights[1][0];

							const xFit = sampleData.x.arraySync().map((row) => row[0]);
							const yFit = xFit.map((x) =>
								coefficients.reduce(
									(sum, coeff, i) => sum + coeff * Math.pow(x, i + 1),
									bias
								)
							);

							setTrainingResults({
								loss: logs.loss,
								curveOfBestFit: { x: xFit, y: yFit },
							});
							setEpochProgress(epoch + 1);
						} catch (callbackError) {
							console.error('Error during onEpochEnd:', callbackError);
						}
					},
				},
			});
		} catch (error) {
			console.error('Error during training:', error);
		} finally {
			setIsTraining(false);
			setEpochProgress(0);
			console.log('Training complete.');
		}
	};

	return (
		<div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white">
			<Header secondBtnText={'Linear'} />
			<div className="flex-grow p-8 flex justify-center items-center">
				<div className="w-full max-w-4xl p-8 bg-white/10 backdrop-blur-md rounded-xl shadow-lg border border-white/20">
					<div className="flex flex-col gap-4">
						<div>
							<p className="text-4xl font-black mb-2">
								Polynomial Regression Visualizer
							</p>
							<p className="text-gray-300">
								This is a polynomial regression model visualizer. It allows you
								to generate a curve of best fit and visualize the data points
								and the curve of best fit over each epoch of training.
							</p>
						</div>

						<div className="flex flex-col items-center gap-6 mt-4">
							<div className="w-full h-96">
								{data ? (
									<Plot
										data={[
											{
												x: data.x.map((row) => row[0]),
												y: data.y,
												mode: 'markers',
												type: 'scatter',
												marker: { color: '#39ff14' },
												name: 'Data Points',
											},
											{
												x: trainingResults.curveOfBestFit.x,
												y: trainingResults.curveOfBestFit.y,
												mode: 'lines',
												type: 'scatter',
												line: { color: '#00bfff', width: 3 },
												name: 'Curve of Best Fit',
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
							<div className="w-full max-w-lg space-y-6">
								<div className="flex flex-col items-center">
									<Tooltip
										title="Controls the degree of the polynomial used to fit the data. Higher degrees result in more complex curves."
										arrow
									>
										<p className="text-white font-bold">Polynomial Degree</p>
									</Tooltip>
									<Slider
										value={degree}
										onChange={(e, newValue) => setDegree(newValue)}
										aria-labelledby="degree-slider"
										step={1}
										min={1}
										max={10}
										valueLabelDisplay="auto"
										sx={{
											color: '#00bfff',
											'& .MuiSlider-thumb': {
												boxShadow: '0 0 10px #00bfff',
											},
										}}
									/>
								</div>
								<div className="flex flex-col items-center">
									<Tooltip
										title="Controls the number of data points used to generate the training dataset."
										arrow
									>
										<p className="text-white font-bold">
											Number of Data Points
										</p>
									</Tooltip>
									<Slider
										value={dataPoints}
										onChange={(e, newValue) => setDataPoints(newValue)}
										aria-labelledby="data-points-slider"
										step={1}
										min={5}
										max={50}
										valueLabelDisplay="auto"
										sx={{
											color: '#39ff14',
											'& .MuiSlider-thumb': {
												boxShadow: '0 0 10px #39ff14',
											},
										}}
									/>
								</div>
							</div>

							{isTraining ? (
								<ProgressBar value={epochProgress} max={100} />
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

'use client';
import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import { createModel, createData, trainModel } from '../model/model';
import * as tf from '@tensorflow/tfjs';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
	const [data, setData] = useState(null);
	const [trainingResults, setTrainingResults] = useState({
		loss: null,
		weights: { slope: null, bias: null },
		lineOfBestFit: { x: [], y: [] },
	});
	const [model, setModel] = useState(createModel());

	const handleTrainModel = async () => {
		const sampleData = createData();
		setData({
			x: sampleData.x.arraySync(),
			y: sampleData.y.arraySync(),
		});

		await trainModel(model, sampleData);

		const weights = model.getWeights();
		const slopeTensor = weights[0];
		const biasTensor = weights[1];

		const slope = slopeTensor.arraySync()[0][0];
		const bias = biasTensor.arraySync()[0];

		const xFit = sampleData.x.arraySync();
		const yFit = xFit.map((x) => slope * x + bias);

		const loss = (
			await model.evaluate(
				sampleData.x.expandDims(1),
				sampleData.y.expandDims(1)
			)
		).dataSync()[0];

		setTrainingResults({
			loss,
			weights: { slope, bias },
			lineOfBestFit: { x: xFit, y: yFit },
		});
	};

	return (
		<div className="grid grid-rows-[20px_1fr_20px] min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			<div className="flex flex-col justify-between">
				<p className="text-4xl font-black">Linear Regression Visualizer</p>
				<p className="text-gray-300 mt-3">
					This is a simple linear regression model visualizer. It allows you to
					generate a line of best fit and visualize the data points and the line
					of best fit over each epoch of training.
				</p>
			</div>
			<div className="flex flex-col items-center gap-4 mt-10">
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
									line: { color: '#00bfff', width: 2 },
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
						<div className="flex items-center justify-center h-full text-gray-300 border-gray-500 border-dashed border-small">
							Data will appear here.
						</div>
					)}
				</div>
				<button
					className="px-4 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 active:bg-blue-800 shadow-sm"
					onClick={handleTrainModel}
				>
					{data ? 'Train New Model' : 'Generate and Train Model'}
				</button>
				{trainingResults.loss !== null && (
					<div className="text-gray-300">
						<p>Final Loss: {trainingResults.loss.toFixed(6)}</p>
						<p>Slope: {trainingResults.weights.slope.toFixed(4)}</p>
						<p>Bias: {trainingResults.weights.bias.toFixed(4)}</p>
					</div>
				)}
			</div>
			<footer className="flex justify-center items-center mt-10 font-light">
				<Link href="https://github.com/maxmalkin/linear-regression-visual">
					Created by Max Malkin, 2024
				</Link>
			</footer>
		</div>
	);
}

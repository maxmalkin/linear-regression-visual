'use client';
import React, { useState } from 'react';
import Plot from 'react-plotly.js';
import { createData, createModel, trainModel } from '../model/model';
import * as tf from '@tensorflow/tfjs';

export default function Home() {
	const [data, setData] = useState(null);
	const [model, setModel] = useState(null);
	const [trainingResults, setTrainingResults] = useState({
		loss: null,
		weights: null,
	});

	const handleUseSampleData = () => {
		const sampleData = createData();
		setData(sampleData);
		const newModel = createModel();
		newModel.compile({
			optimizer: tf.train.sgd(0.01),
			loss: (predicted, actual) => predicted.sub(actual).square().mean(),
		});
		setModel(newModel);
		setTrainingResults({ loss: null, weights: null });
	};

	const handleTrainModel = async () => {
		if (data && model) {
			await trainModel(model, data);

			const weights = model.getWeights();
			const slope = weights[0].dataSync()[0];
			const bias = weights[1].dataSync()[0];

			const finalLossTensor = await model.evaluate(
				data.x.expandDims(1),
				data.y.expandDims(1)
			);
			const finalLoss = finalLossTensor.dataSync()[0];

			setTrainingResults({ loss: finalLoss, weights: { slope, bias } });
		}
	};

	return (
		<div className="grid grid-rows-[20px_1fr_20px] min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
			<div className="flex justify-between items-center">
				<p className="text-4xl font-black">Linear Regression Visualizer</p>
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
								...(trainingResults.weights
									? [
											{
												x: [0, 1],
												y: [
													trainingResults.weights.bias,
													trainingResults.weights.slope +
														trainingResults.weights.bias,
												],
												mode: 'lines',
												type: 'scatter',
												line: { color: '#00bfff', width: 2 },
											},
									  ]
									: []),
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
						<div className="flex items-center justify-center h-full text-gray-300">
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
				{data && model && (
					<button
						className="px-4 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 active:bg-green-800 shadow-sm"
						onClick={handleTrainModel}
					>
						Train Model
					</button>
				)}
				{trainingResults.loss !== null && (
					<div className="text-gray-300">
						<p>Final Loss: {trainingResults.loss.toFixed(4)}</p>
						<p>Slope: {trainingResults.weights.slope.toFixed(4)}</p>
						<p>Bias: {trainingResults.weights.bias.toFixed(4)}</p>
					</div>
				)}
			</div>
		</div>
	);
}

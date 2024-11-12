'use client';
import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { createModel, createData, trainModel } from '../model/model';
import * as tf from '@tensorflow/tfjs';

export default function Home() {
	const [data, setData] = useState(null);
	const [trainingResults, setTrainingResults] = useState({
		loss: null,
		weights: { slope: null, bias: null },
	});
	const [model, setModel] = useState(null);

	useEffect(() => {
		const initializedModel = createModel();
		initializedModel.compile({
			optimizer: tf.train.adam(0.01),
			loss: (predicted, actual) => predicted.sub(actual).square().mean(),
		});
		setModel(initializedModel);
	}, [model]);

	const handleTrainModel = async () => {
		const sampleData = createData();
		setData({
			x: sampleData.x.arraySync(),
			y: sampleData.y.arraySync(),
		});

		trainModel(model, sampleData);

		const weights = model.getWeights();
		const slopeTensor = weights[0];
		const biasTensor = weights[1];

		const slope = slopeTensor.dataSync()[0];
		const bias = biasTensor.dataSync()[0];
		const loss = (
			await model.evaluate(
				sampleData.x.expandDims(1),
				sampleData.y.expandDims(1)
			)
		).dataSync()[0];

		setTrainingResults({ loss, weights: { slope, bias } });
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
									x: data.x,
									y: data.y,
									mode: 'markers',
									type: 'scatter',
									marker: { color: '#39ff14' },
								},
								...(trainingResults.weights.slope !== null
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
					onClick={handleTrainModel}
				>
					{data ? 'Train Model Again' : 'Generate and Train Model'}
				</button>
				{trainingResults.loss !== null && (
					<div className="text-gray-300">
						<p>Final Loss: {trainingResults.loss.toFixed(6)}</p>
						<p>Slope: {trainingResults.weights.slope.toFixed(4)}</p>
						<p>Bias: {trainingResults.weights.bias.toFixed(4)}</p>
					</div>
				)}
			</div>
		</div>
	);
}

import React, { useState } from "react";
import * as tf from "@tensorflow/tfjs";
import { createModel, trainModel, predict } from "./model";

const TrainModel = () => {
	const [model, setModel] = useState(null);
	const [loss, setLoss] = useState([]);
	const [input, setInput] = useState("");
	const [prediction, setPrediction] = useState(null);

	const handleTrain = async () => {
		const xData = tf.linspace(0, 1, 100);
		const yData = tf
			.add(tf.mul(2, xData), 1)
			.add(tf.randomNormal([100], 0, 0.1));

		const newModel = createModel();
		setModel(newModel);

		await trainModel(newModel, xData, yData, (epoch, loss) => {
			setLoss((prev) => [...prev, { epoch, loss }]);
		});
	};

	const handlePredict = () => {
		if (!model) return alert("Train the model first!");
		const prediction = predict(model, parseFloat(input));
		setPrediction(prediction);
	};

	return (
		<div>
			<h1>Linear Regression Predictor</h1>
			<button onClick={handleTrain}>Train Model</button>
			{loss.map((log) => (
				<p key={log.epoch}>
					Epoch {log.epoch + 1}: Loss = {log.loss}
				</p>
			))}
			<input
				type="number"
				placeholder="Enter a value"
				value={input}
				onChange={(e) => setInput(e.target.value)}
			/>
			<button onClick={handlePredict}>Predict</button>
			{prediction !== null && <p>Prediction: {prediction}</p>}
		</div>
	);
};

export default TrainModel;

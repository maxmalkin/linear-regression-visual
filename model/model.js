import * as tf from "@tensorflow/tfjs";

function createModel() {
	const model = tf.sequential();

	model.add(tf.layers.dense({ units: 3, inputShape: [1], activation: "relu" }));
	model.add(tf.layers.dense({ units: 1 }));

	return model;
}

const createData = () => {
	const xData = tf.linspace(0, 1, 100);
	const yData = tf.add(tf.mul(2, xData), 1).add(tf.randomNormal([100], 0, 0.1));
	return { x: xData, y: yData };
};

const data = createData();

function loss(predicted, actual) {
	return predicted.sub(actual).square().mean();
}

const model = createModel();
model.compile({
	optimizer: tf.train.sgd(0.01),
	loss: loss,
});

async function trainModel() {
	await model.fit(data.x.expandDims(1), data.y.expandDims(1), {
		epochs: 50,
		callbacks: {
			onEpochEnd: (epoch, logs) => {
				console.log(`Epoch ${epoch + 1}: loss = ${logs.loss}`);
			},
		},
	});
}

async function infer() {
	await trainModel();

	const weights = model.getWeights();
	const unit = weights[0].dataSync();
	const bias = weights[1].dataSync();
	console.log(`Unit: ${unit}`);
	console.log(`Bias: ${bias}`);

	const y = model.predict(tf.tensor1d([2]).expandDims(1));
}

infer();
import * as tf from '@tensorflow/tfjs';

export function createData(n = 2, dataPoints = 10) {
	const xData = tf.linspace(0, 1, dataPoints);
	const xExpanded = tf.stack(
		[...Array(n).keys()].map((i) => tf.pow(xData, i + 1)),
		1
	);

	let yData = tf.randomNormal([dataPoints], 0, 0.1);
	for (let i = 0; i <= n; i++) {
		const coefficient = Math.random() * 10 - 5;
		yData = yData.add(tf.mul(coefficient, tf.pow(xData, i)));
	}
	return { x: xExpanded, y: yData };
}

function loss(predicted, actual) {
	return predicted.sub(actual).square().mean();
}

export function createModel(degree) {
	const model = tf.sequential();

	model.add(
		tf.layers.dense({
			units: 1,
			inputShape: [degree],
		})
	);

	model.compile({
		optimizer: tf.train.sgd(0.1),
		loss: 'meanSquaredError',
	});

	return model;
}

export async function trainModel(model, data, epochs = 200) {
	await model.fit(data.x, data.y.expandDims(1), {
		epochs,
		callbacks: {
			onEpochEnd: (epoch, logs) => {
				console.log(`Epoch ${epoch + 1}: loss = ${logs.loss}`);
			},
		},
	});
}

export async function infer(degrees, dataPoints = 10) {
	for (const n of degrees) {
		console.log(`\nTraining polynomial regression model with degree n=${n}`);
		const data = createData(n, dataPoints);
		const model = createModel(n);
		await trainModel(model, data);

		const weights = await Promise.all(
			model.getWeights().map(async (weight) => (await weight.data())[0])
		);
		console.log(`Weights: ${weights}`);
	}
}

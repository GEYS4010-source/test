const URL = "https://teachablemachine.withgoogle.com/models/zTaXGph_1/" ;

let model, webcam, ctx, maxPredictions;
let lastPrediction = "";

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmPose.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const size = 200;
    const flip = true;
    webcam = new tmPose.Webcam(size, size, flip);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    ctx = canvas.getContext("2d");
    document.querySelector("div").appendChild(canvas);
}

async function loop(timestamp) {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
    const prediction = await model.predict(posenetOutput);

    let highestProbability = 0;
    let predictionText = "";

    for (let i = 0; i < maxPredictions; i++) {
        if (prediction[i].probability.toFixed(2) > highestProbability) {
            highestProbability = prediction[i].probability.toFixed(2);
            predictionText = prediction[i].className;
        }
    }

    if (highestProbability > 0.90 && predictionText !== lastPrediction) {
        lastPrediction = predictionText;
        document.getElementById("recognizedText").innerText = predictionText;
    }

    ctx.drawImage(webcam.canvas, 0, 0);
    if (pose) {
        tmPose.drawKeypoints(pose.keypoints, 0.5, ctx);
        tmPose.drawSkeleton(pose.keypoints, 0.5, ctx);
    }
}

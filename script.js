const URL = "https://teachablemachine.withgoogle.com/models/N4TTFu61x/";
let model, webcam, labelContainer, maxPredictions;

const infoFlores = {
    "Rosas": "🌹 Cuidados: Necesitan mucha luz solar (mínimo 6 horas). Riego regular pero sin encharcar. Poda las flores marchitas.",
    "Girasoles": "🌻 Cuidados: Requieren sol directo constante. Riego abundante durante el crecimiento. Suelo bien drenado.",
    "Tulipanes": "🌷 Cuidados: Prefieren climas frescos. Riego moderado (solo cuando la tierra esté seca). No les gusta el calor extremo.",
    "Margaritas": "🌼 Cuidados: Muy resistentes. Riego cuando el suelo esté seco. Les gusta el sol y la media sombra."
};

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const flip = true; 
    webcam = new tmImage.Webcam(200, 200, flip); 
    await webcam.setup(); 
    await webcam.play();
    window.requestAnimationFrame(loop);

    document.getElementById("webcam-container").appendChild(webcam.canvas);
}

async function loop() {
    webcam.update(); 
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    
    // Buscamos la predicción más alta
    let highestProb = 0;
    let bestClass = "";

    for (let i = 0; i < maxPredictions; i++) {
        if (prediction[i].probability > highestProb) {
            highestProb = prediction[i].probability;
            bestClass = prediction[i].className;
        }
    }

    // Si la probabilidad es alta (mayor al 80%), mostramos el resultado
    if (highestProb > 0.80) {
        document.getElementById("flower-name").innerText = "Es un(a): " + bestClass;
        // Aquí sacamos la info del objeto 'infoFlores'
        document.getElementById("care-info").innerText = infoFlores[bestClass];
    } else {
        document.getElementById("flower-name").innerText = "Identificando...";
        document.getElementById("care-info").innerText = "";
    }

}

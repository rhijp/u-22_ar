const externalCamera = document.getElementById('externalCamera');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const externalConstraints = {
    video: { facingMode: { exact: "environment" } }
};

const internalConstraints = {
    video: { facingMode: "user" }
};

async function startCameras() {
    try {
        // 外カメラの映像を取得して表示
        const externalStream = await navigator.mediaDevices.getUserMedia(externalConstraints);
        externalCamera.srcObject = externalStream;

        // 内カメラの映像を取得して合成
        const internalStream = await navigator.mediaDevices.getUserMedia(internalConstraints);
        const internalCamera = document.createElement('video');
        internalCamera.srcObject = internalStream;
        internalCamera.play();

        internalCamera.addEventListener('loadeddata', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            draw(internalCamera);
        });

    } catch (error) {
        console.error("カメラの取得に失敗しました:", error);
    }
}

function draw(internalCamera) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(internalCamera, 50, 50, 100, 100); // 小さく表示
    requestAnimationFrame(() => draw(internalCamera));
}

startCameras();

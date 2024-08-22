const externalCamera = document.getElementById('externalCamera');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const externalConstraints = {
    video: { facingMode: { exact: "environment" } } // 外カメラを指定
};

const internalConstraints = {
    video: { facingMode: "user" } // 内カメラを指定
};

async function startCameras() {
    try {
        // 外カメラの映像を取得して表示
        const externalStream = await navigator.mediaDevices.getUserMedia(externalConstraints);
        externalCamera.srcObject = externalStream;

        // 内カメラの映像を取得
        const internalStream = await navigator.mediaDevices.getUserMedia(internalConstraints);
        const internalCamera = document.createElement('video');
        internalCamera.srcObject = internalStream;
        internalCamera.play();

        // Canvasの大きさを設定（ウィンドウのサイズに対応）
        canvas.width = 100;
        canvas.height = 100;

        // 内カメラの映像をCanvasに描画
        internalCamera.addEventListener('loadeddata', () => {
            draw(internalCamera);
        });

    } catch (error) {
        console.error("カメラの取得に失敗しました:", error);
    }
}

function draw(internalCamera) {
    // 内カメラの映像をキャンバスに描画
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(internalCamera, 0, 0, canvas.width, canvas.height);
    requestAnimationFrame(() => draw(internalCamera));
}

// カメラを開始
startCameras();

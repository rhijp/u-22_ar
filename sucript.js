const internalCanvas = document.getElementById('internalCanvas');
const externalCanvas = document.getElementById('externalCanvas');
const internalCtx = internalCanvas.getContext('2d');
//const externalCtx = externalCanvas.getContext('2d');

const internalConstraints = {
    video: true // 内カメラを指定
};

let net;

async function loadPosenet() {
    // PoseNetモデルを読み込む
    net = await posenet.load();
    startInternalCamera();
}

async function startInternalCamera() {
    try {
        const internalStream = await navigator.mediaDevices.getUserMedia(internalConstraints);
        const internalCamera = document.createElement('video');
        internalCamera.srcObject = internalStream;
        internalCamera.play();

        internalCamera.addEventListener('loadeddata', () => {
            internalCamera.width = internalCamera.videoWidth;
            internalCamera.height = internalCamera.videoHeight;

            // キャンバスのサイズをビデオ要素のサイズに合わせる
            internalCanvas.width = internalCamera.videoWidth;
            internalCanvas.height = internalCamera.videoHeight;

        
            detectPose(internalCamera);
        });

    } catch (error) {
        console.error("内カメラの取得に失敗しました:", error);
    }
}

async function detectPose(internalCamera) {
    const pose = await net.estimateSinglePose(internalCamera, {
        flipHorizontal: false
    });

    // ポーズ推定結果をコンソールに出力
    console.log('Pose estimation result:', pose);

    // 内カメラの映像をキャンバスに描画
    internalCtx.clearRect(0, 0, internalCanvas.width, internalCanvas.height);
    internalCtx.drawImage(internalCamera, 0, 0, internalCanvas.width, internalCanvas.height);

    // ポーズ推定結qq果をキャンバスに描画
    drawKeypoints(pose.keypoints, 0.6, internalCtx);
    drawSkeleton(pose.keypoints, 0.6, internalCtx);

    displayConfidence(pose.score);

    requestAnimationFrame(() => detectPose(internalCamera));
}

function drawKeypoints(keypoints, minConfidence, ctx) {
    ctx.fillStyle = 'red';
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;

    keypoints.forEach(point => {
        if (point.score > minConfidence) {
            const { y, x } = point.position;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fill();
        }
    });
}

function drawSkeleton(keypoints, minConfidence, ctx) {
    const adjacentKeyPoints = posenet.getAdjacentKeyPoints(keypoints, minConfidence);

    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;

    adjacentKeyPoints.forEach((keypoints) => {
        const [[x1, y1], [x2, y2]] = keypoints.map(kp => [kp.position.x, kp.position.y]);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
    });
}
function displayConfidence(confidence) {
    // 信頼度を右下に表示
    internalCtx.font = '16px Arial';
    internalCtx.fillStyle = 'white';
    internalCtx.textAlign = 'right';
    internalCtx.fillText(`Confidence: ${confidence.toFixed(2)}`, internalCanvas.width - 10, internalCanvas.height - 10);
}

// PoseNetモデルをロードして、カメラを開始
loadPosenet();

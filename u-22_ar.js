const externalCamera = document.getElementById('externalCamera');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const externalConstraints = {
    video: { facingMode: { exact: "environment" } } // 外カメラを指定
};

const internalConstraints = {
    video: { facingMode: "user" } // 内カメラを指定
};

let net;

async function loadPosenet() {
    net = await posenet.load();
    startCameras();
}

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

        // Canvasのサイズを設定
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        internalCamera.addEventListener('loadeddata', () => {
            detectPose(internalCamera);
        });

    } catch (error) {
        console.error("カメラの取得に失敗しました:", error);
    }
}

async function detectPose(internalCamera) {
    const pose = await net.estimateSinglePose(internalCamera, {
        flipHorizontal: false
    });

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 全身を小人として表示
    if (pose && pose.keypoints) {
        const keypoints = pose.keypoints;
        ctx.fillStyle = 'blue';
        keypoints.forEach(point => {
            if (point.score > 0.5) {
                const { y, x } = point.position;
                ctx.beginPath();
                ctx.arc(x / 3, y / 3, 5, 0, 2 * Math.PI); // 小人として小さく描画
                ctx.fill();
            }
        });
    }

    requestAnimationFrame(() => detectPose(internalCamera));
}

loadPosenet();

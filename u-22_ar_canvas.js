let net;

async function loadPosenet() {
    net = await posenet.load();
    startCameras();
}

async function estimatePose(internalCamera) {
    const pose = await net.estimateSinglePose(internalCamera, {
        flipHorizontal: false
    });

    // ジャンプの検出（例えば、膝が腰より高くなる場合）
    const leftKnee = pose.keypoints.find(point => point.part === 'leftKnee');
    const rightKnee = pose.keypoints.find(point => point.part === 'rightKnee');
    const nose = pose.keypoints.find(point => point.part === 'nose');

    if (leftKnee.score > 0.5 && rightKnee.score > 0.5 && nose.score > 0.5) {
        const averageKneeY = (leftKnee.position.y + rightKnee.position.y) / 2;
        if (nose.position.y < averageKneeY) {
            console.log("ジャンプ検出！");
            // ここでジャンプアクションを処理
        }
    }

    requestAnimationFrame(() => estimatePose(internalCamera));
}

async function startCameras() {
    try {
        const externalStream = await navigator.mediaDevices.getUserMedia(externalConstraints);
        externalCamera.srcObject = externalStream;

        const internalStream = await navigator.mediaDevices.getUserMedia(internalConstraints);
        const internalCamera = document.createElement('video');
        internalCamera.srcObject = internalStream;
        internalCamera.play();

        internalCamera.addEventListener('loadeddata', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            draw(internalCamera);
            estimatePose(internalCamera);
        });

    } catch (error) {
        console.error("カメラの取得に失敗しました:", error);
    }
}

loadPosenet();

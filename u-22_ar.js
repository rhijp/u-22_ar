const net = await posenet.load();

async function detectPose() {
    const pose = await net.estimateSinglePose(internalCamera, {
        flipHorizontal: false
    });

    const nose = pose.keypoints.find(point => point.part === 'nose');
    const leftAnkle = pose.keypoints.find(point => point.part === 'leftAnkle');
    const rightAnkle = pose.keypoints.find(point => point.part === 'rightAnkle');

    if (nose && leftAnkle && rightAnkle) {
        const averageAnkleY = (leftAnkle.position.y + rightAnkle.position.y) / 2;
        if (nose.position.y < averageAnkleY) {
            console.log('ジャンプ検出');
            // AR内のオブジェクトを操作するなど
        }
    }

    requestAnimationFrame(detectPose);
}

detectPose();

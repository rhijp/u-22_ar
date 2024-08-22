async function startCameras() {
    try {
        console.log("カメラを取得中...");
        const internalStream = await navigator.mediaDevices.getUserMedia(internalConstraints);
        console.log("内カメラのストリーム: ", internalStream);
        const internalCamera = document.getElementById('internalCamera');
        internalCamera.srcObject = internalStream;

        const externalStream = await navigator.mediaDevices.getUserMedia(externalConstraints);
        console.log("外カメラのストリーム: ", externalStream);
        const externalCamera = document.getElementById('externalCamera');
        externalCamera.srcObject = externalStream;
    } catch (error) {
        console.error("カメラの取得に失敗しました:", error);
    }
}

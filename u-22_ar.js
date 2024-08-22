async function startCameras() {
    try {
        // 外カメラの映像を取得して表示
        const externalStream = await navigator.mediaDevices.getUserMedia(externalConstraints);
        console.log('外カメラのストリームを取得しました:', externalStream);
        externalCamera.srcObject = externalStream;

        // 内カメラの映像を取得
        const internalStream = await navigator.mediaDevices.getUserMedia(internalConstraints);
        console.log('内カメラのストリームを取得しました:', internalStream);
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

let capture;
let faceMesh;
let faces = [];

function setup() {
  createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO);
  capture.size(640, 480);
  capture.hide();

  // 初始化 faceMesh
  faceMesh = ml5.faceMesh(capture, { maxFaces: 1, refineLandmarks: false, flipHorizontal: false }, () => console.log("Model Ready!"));
  faceMesh.detectStart(capture, (results) => { faces = results; });
}

function draw() {
  background(220);

  // 計算影像縮放
  let vW = 0, vH = 0;
  let vx = width / 2, vy = height / 2;

  if (capture.width > 0 && capture.height > 0) {
    let videoAspect = capture.width / capture.height;
    let targetW = width * 0.5;
    let targetH = height * 0.5;

    if (videoAspect > targetW / targetH) {
      vW = targetW;
      vH = vW / videoAspect;
    } else {
      vH = targetH;
      vW = vH * videoAspect;
    }

    vx = (width - vW) / 2;
    vy = (height - vH) / 2;
  }

  imageMode(CORNER);
  if (vW > 0) image(capture, vx, vy, vW, vH);

  // 繪製耳垂裝飾
  if (faces.length > 0) {
    let keypoints = faces[0].keypoints;
    
    // 132 是右耳垂區域, 361 是左耳垂區域 (MediaPipe 索引)
    const earIndices = [132, 361];
    
    fill(255, 255, 0); // 黃色
    noStroke();

    earIndices.forEach(idx => {
      let p = keypoints[idx];
      if (p) {
        // 將座標從影像尺寸映射到畫布實際顯示的位置
        let tx = map(p.x, 0, capture.width, vx, vx + vW);
        let ty = map(p.y, 0, capture.height, vy, vy + vH);
        
        // 繪製三個圓圈形成耳環樣子
        let gap = 15;  // 圓圈間距
        let size = 10; // 圓圈大小
        for (let i = 0; i < 3; i++) {
          circle(tx, ty + (i * gap), size);
        }
      }
    });
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
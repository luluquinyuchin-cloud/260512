let capture;
let faceMesh;
let faces = [];
let earringImg;

function preload() {
  // 載入耳環圖片
  earringImg = loadImage('耳環圖片/acc1_ring.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO);
  capture.size(640, 480);
  capture.hide();
  imageMode(CORNER);

  // 初始化 faceMesh
  faceMesh = ml5.faceMesh(capture, { maxFaces: 1, refineLandmarks: false, flipHorizontal: false }, () => console.log("Model Ready!"));
  faceMesh.detectStart(capture, (results) => { faces = results; });
}

function draw() {
  background(220);

  let targetW = width * 0.8; // 設定目標顯示寬度
  let targetH = height * 0.8; // 設定目標顯示高度
  let videoAspect = capture.width / capture.height;
    let vW, vH;

    if (videoAspect > targetW / targetH) {
      vW = targetW;
      vH = vW / videoAspect;
    } else {
      vH = targetH;
      vW = vH * videoAspect;
    }

    let vx = (width - vW) / 2;
    let vy = (height - vH) / 2;

    // 繪製視訊畫面
    image(capture, vx, vy, vW, vH);

 if (faces.length > 0) {
      let keypoints = faces[0].keypoints;
      const earIndices = [234, 454]; // 臉部側邊的參考點索引
      
      fill(255, 255, 0); // 黃色
      noStroke();

      earIndices.forEach(idx => {
        let pt = keypoints[idx];
        if (pt) {
          // 將座標從影片尺寸映射到畫布顯示位置
          let tx = map(pt.x, 0, capture.width, vx, vx + vW);
          let ty = map(pt.y, 0, capture.height, vy, vy + vH);

          // 確保圖片已成功載入才繪製
          if (earringImg && earringImg.width > 0) {
            push();
            imageMode(CENTER);
            let imgW = 40; // 耳環寬度，可視情況調整
            let imgH = earringImg.height * (imgW / earringImg.width);
            
            // tx 是耳垂點，ty + imgH/2 讓耳環圖片的頂部剛好掛在耳垂上
            image(earringImg, tx, ty + imgH / 2, imgW, imgH);
            pop();
          }
        }
      });
    }
}
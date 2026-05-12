let capture;
let faceMesh;
let handPose;
let faces = [];
let hands = [];
let earringImages = [];
let currentEarringIndex = -1; // 預設不顯示，直到偵測到手勢

function preload() {
  // 載入 5 種耳環圖片，路徑更新為耳環圖片/acc/
  earringImages[0] = loadImage('耳環圖片/acc/acc1_ring.png');
  earringImages[1] = loadImage('耳環圖片/acc/acc2_pearl.png');
  earringImages[2] = loadImage('耳環圖片/acc/acc3_tassel.png');
  earringImages[3] = loadImage('耳環圖片/acc/acc4_jade.png');
  earringImages[4] = loadImage('耳環圖片/acc/acc5_phoenix.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  capture = createCapture(VIDEO);
  capture.size(640, 480);
  capture.hide();

  // 初始化 faceMesh
  faceMesh = ml5.faceMesh(capture, { maxFaces: 1, refineLandmarks: false, flipHorizontal: false }, () => console.log("FaceMesh Ready!"));
  faceMesh.detectStart(capture, (results) => { faces = results; });

  // 初始化 handPose
  handPose = ml5.handPose(capture, { maxHands: 1, flipHorizontal: false }, () => console.log("HandPose Ready!"));
  handPose.detectStart(capture, (results) => { hands = results; });
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

    // 手勢辨識：計算伸出的手指數量
    if (hands.length > 0) {
      let fingerCount = 0;
      let hand = hands[0];
      
      // 使用指尖與手掌中心（0號點）的距離來判斷手指是否伸直
      const tips = [4, 8, 12, 16, 20];
      const joints = [2, 6, 10, 14, 18];
      for (let i = 0; i < 5; i++) {
        let dTip = dist(hand.keypoints[tips[i]].x, hand.keypoints[tips[i]].y, hand.keypoints[0].x, hand.keypoints[0].y);
        let dJoint = dist(hand.keypoints[joints[i]].x, hand.keypoints[joints[i]].y, hand.keypoints[0].x, hand.keypoints[0].y);
        if (dTip > dJoint) fingerCount++;
      }

      // 根據手指數量設定目前的耳環編號 (1~5)
      if (fingerCount >= 1 && fingerCount <= 5) {
        currentEarringIndex = fingerCount - 1;
      }
    }

    // 繪製耳環
    if (faces.length > 0 && currentEarringIndex !== -1) {
      let keypoints = faces[0].keypoints;
      let img = earringImages[currentEarringIndex];

      // 以左右耳偵測點的距離作為臉部大小的比例基準
      let dEars = dist(keypoints[234].x, keypoints[234].y, keypoints[454].x, keypoints[454].y);
      
      const earIndices = [234, 454]; // 臉部側邊的參考點索引

      earIndices.forEach(idx => {
        let pt = keypoints[idx];
        if (pt) {
          // 定義偏移比率 (比率越大，移動越多)
          let ratioOut = 0.05; // 往外移的比率
          let ratioUp = 0.05;  // 往上移的比率
          
          // 計算偏移量 (234 在右側/螢幕左，454 在左側/螢幕右)
          let offsetX = (idx === 234) ? -dEars * ratioOut : dEars * ratioOut;
          let offsetY = -dEars * ratioUp;

          // 將「偏移後的座標」從影片尺寸映射到畫布顯示位置
          let tx = map(pt.x + offsetX, 0, capture.width, vx, vx + vW);
          let ty = map(pt.y + offsetY, 0, capture.height, vy, vy + vH);

          if (img && img.width > 0) {
            push();
            imageMode(CENTER);
            // 耳環大小也隨臉部比例縮放
            let imgW = dEars * 0.2 * (vW / capture.width);
            let imgH = img.height * (imgW / img.width);
            // ty + imgH / 2 讓耳環圖片的頂部掛在點位上
            image(img, tx, ty + imgH / 2, imgW, imgH);
            pop();
          }
        }
      });
    }
}
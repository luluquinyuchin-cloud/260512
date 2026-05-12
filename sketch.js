let capture;
let faceMesh;
let faces = [];

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

  . let targetH = height * 0.5;
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

 if (faces.length > 0) {
      let keypoints = faces[0].keypoints;
      const earIndices = [132,, 0); // 黃色

 1
let i = 0; i < 3; i++) {
            circle(tx, ty + (i * gap), size);
          }
        }
      });
    }
  }
}oe(
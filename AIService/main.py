"""
EngageAI — AI Microservice
===========================
EfficientNet-B0 (timm) engagement prediction service.
Loads engagement_model_v3.pth once at startup.

Model: EfficientNet-B0, 2 classes
  Class 0 = Not Engaged
  Class 1 = Engaged
  engagement_score = P(class=1)
  Input: RGB 224x224, ImageNet normalisation
"""

import os
import io
import time
import logging
from contextlib import asynccontextmanager

import cv2
import numpy as np
import torch
import torch.nn.functional as F
import timm
from PIL import Image
from fastapi import FastAPI, File, UploadFile, HTTPException, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

# Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-8s  %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
log = logging.getLogger("engageai.ai")

# Paths
BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model", "engagement_model_v3.pth")

# Pre-processing constants
IMG_SIZE  = 224
NORM_MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
NORM_STD  = np.array([0.229, 0.224, 0.225], dtype=np.float32)

CLASS_NOT_ENGAGED = 1   # model was trained: index 1 → not engaged
CLASS_ENGAGED     = 0   # model was trained: index 0 → engaged

STATE_THRESHOLDS = [
    (0.70, "Attentive"),
    (0.40, "Neutral"),
    (0.15, "Distracted"),
    (0.00, "Inactive"),
]

CONFIDENCE_FLOOR = 0.38

# Face detector
_face_cascade = cv2.CascadeClassifier(
    cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
)


def count_faces(frame_bgr: np.ndarray) -> int:
    gray  = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2GRAY)
    faces = _face_cascade.detectMultiScale(
        gray, scaleFactor=1.1, minNeighbors=5, minSize=(48, 48)
    )
    return len(faces)


class EngagementModel:
    """Loads engagement_model_v3.pth and runs EfficientNet-B0 inference."""

    def __init__(self):
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(
                f"Model not found: {MODEL_PATH}\n"
                "Copy engagement_model_v3.pth into AIService/model/"
            )
        log.info("Loading engagement_model_v3.pth ...")
        self.net = timm.create_model("efficientnet_b0", pretrained=False, num_classes=2)
        sd = torch.load(MODEL_PATH, map_location="cpu", weights_only=False)
        self.net.load_state_dict(sd, strict=True)
        self.net.eval()
        # warm-up
        with torch.no_grad():
            _ = self.net(torch.zeros(1, 3, IMG_SIZE, IMG_SIZE))
        log.info("Model ready.")

    def preprocess(self, frame_bgr: np.ndarray) -> torch.Tensor:
        rgb    = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
        rsz    = cv2.resize(rgb, (IMG_SIZE, IMG_SIZE))
        arr    = rsz.astype(np.float32) / 255.0
        arr    = (arr - NORM_MEAN) / NORM_STD
        arr    = np.transpose(arr, (2, 0, 1))
        return torch.from_numpy(arr).unsqueeze(0)

    @torch.no_grad()
    def predict(self, frame_bgr: np.ndarray):
        tensor = self.preprocess(frame_bgr)
        logits = self.net(tensor)
        probs  = F.softmax(logits, dim=1)[0]
        score  = round(float(probs[CLASS_ENGAGED].item()), 4)
        conf   = round(float(probs.max().item()), 4)
        return score, conf


_model: EngagementModel | None = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global _model
    log.info("Starting EngageAI AI Service ...")
    _model = EngagementModel()
    yield
    log.info("EngageAI AI Service shut down.")


app = FastAPI(
    title="EngageAI Engagement Prediction",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "model": "engagement_model_v3 (EfficientNet-B0)",
        "loaded": _model is not None,
        "timestamp": time.time(),
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    POST a JPEG/PNG frame.
    Returns: { engagement_score, state, confidence, face_count, flags }
    """
    if _model is None:
        raise HTTPException(status_code=503, detail="Model not loaded.")

    # Decode image
    try:
        raw     = await file.read()
        pil     = Image.open(io.BytesIO(raw)).convert("RGB")
        bgr     = cv2.cvtColor(np.array(pil), cv2.COLOR_RGB2BGR)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Cannot decode image: {e}")

    # Face count
    faces          = count_faces(bgr)
    no_face        = faces == 0
    multiple_faces = faces > 1

    # Inference
    try:
        score, conf = _model.predict(bgr)
    except Exception as e:
        log.error("Inference error: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail=f"Inference failed: {e}")

    # Anti-spoof overrides
    if no_face:
        score, conf = 0.0, 0.0
    elif conf < CONFIDENCE_FLOOR:
        score = round(score * 0.6, 4)

    # Map score to state label
    state = "Inactive"
    for threshold, label in STATE_THRESHOLDS:
        if score >= threshold:
            state = label
            break

    log.info("score=%.3f  state=%-12s  conf=%.3f  faces=%d", score, state, conf, faces)

    return {
        "engagement_score": score,
        "state":            state,
        "confidence":       conf,
        "face_count":       faces,
        "flags": {
            "no_face":        no_face,
            "multiple_faces": multiple_faces,
        },
    }


@app.exception_handler(Exception)
async def _err(_req: Request, exc: Exception):
    log.error("Unhandled: %s", exc, exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error.", "error": str(exc)},
    )

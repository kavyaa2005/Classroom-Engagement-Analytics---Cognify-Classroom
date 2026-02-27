Place your trained model file in this directory.

Supported file names:
  - engagement_model.onnx     (recommended — fastest inference)
  - engagement_model.h5       (Keras / TensorFlow)
  - engagement_model.pt       (PyTorch)
  - engagement_model.pkl      (scikit-learn / joblib)

The AIService will auto-detect whichever file is present and
load it in that priority order (onnx > h5 > pt > pkl).

If NO model file is present, the service runs a mock predictor
that uses image brightness + edge density as a rough proxy.
This is useful for development/testing without the real model.

Once you have a trained model, simply copy it here and restart
the AI service — no code changes required.

# AEGES-Q

## Quantum-Enhanced Adaptive Network Security

AEGES-Q is a research-oriented cybersecurity framework that investigates
the combination of network intrusion detection, cryptographic
protection, quantum machine learning (QML), and a future adaptive
security policy layer.

The project is being developed in stages. The current stage establishes
measurable classical baselines first, validates the initial quantum
machine learning pipeline under local resource constraints, and provides
a working FastAPI backend for the completed classical IDS and classical
cryptographic components.

This README documents **only the work completed at the current stage**.
Future research directions are explicitly separated from implemented
functionality.

------------------------------------------------------------------------

## 1. Project Objective

The long-term objective of AEGES-Q is to develop an adaptive
network-security architecture in which the security posture of network
traffic can influence the cryptographic protection applied to
application data.

The intended architecture is:

``` text
Network Traffic
       |
       v
Feature Extraction
       |
       v
Variant E Preprocessing
26 Numerical + 3 Categorical
177 Transformed Features
       |
       +-----------------------------+
       |                             |
       v                             v
Classical ML IDS               QML Research Path
Random Forest                  PCA
       |                       4 Components
       |                       4-Qubit Model
       v                             |
Threat Assessment                    v
       |                       Quantum Circuit
       |                             |
       +-------------+---------------+
                     |
                     v
             Adaptive Policy Engine
                     |
          +----------+----------+----------+
          |          |          |          |
          v          v          v          v
       Normal     Elevated     High     Critical
          |          |          |          |
          +----------+----------+----------+
                     |
                     v
              Security Policy
                     |
                     v
             Key Establishment
                     |
          +----------+----------+
          |                     |
          v                     v
       X25519                 Future Hybrid /
       Classical              PQC Layer
          |
          v
      HKDF-SHA256
          |
          v
      AES-256-GCM
          |
          v
Protected Application Data
```

The architecture above represents the intended direction of the system.
At the current stage, the classical IDS and classical cryptographic
components are implemented and operational, while the QML component is
an experimental research baseline. The complete adaptive quantum/PQC
system is not claimed as finished.

------------------------------------------------------------------------

# 2. Current Progress

  Component                                   Current Status
  ------------------------------------------- -----------------
  UNSW-NB15 dataset preparation               Complete
  Feature analysis and preprocessing          Complete
  Variant E preprocessing pipeline            Complete
  Classical model comparison                  Complete
  Random Forest IDS baseline                  Complete
  Random Forest artifact                      Complete
  Classical IDS backend integration           Complete
  AES-256-GCM benchmark                       Complete
  X25519 + HKDF-SHA256 benchmark              Complete
  AES-256-GCM backend service                 Operational
  X25519/HKDF backend service                 Operational
  End-to-end cryptographic API verification   Complete
  Basic quantum circuit experiments           Complete
  Quantum feature encoding                    Complete
  Entanglement experiments                    Complete
  Variational circuit experiments             Complete
  Initial QML benchmark                       Complete
  Persistent database-backed sessions         Not implemented
  Post-quantum cryptography benchmark         Pending
  Full adaptive policy integration            Pending
  Large-scale QML experiments                 Pending
  Physical quantum-hardware experiments       Pending

The current project position can therefore be summarized as:

``` text
Classical IDS                    COMPLETE
Classical Cryptographic Layer   COMPLETE
Initial QML Research            BASELINE COMPLETE
PQC Research                    PENDING
Adaptive Integration            PENDING
Full Quantum/PQC System         FUTURE WORK
```

------------------------------------------------------------------------

# 3. Research Dataset: UNSW-NB15

AEGES-Q uses the UNSW-NB15 dataset as the primary network
intrusion-detection dataset.

The original author-provided train/test split is retained:

-   Training samples: 82,332
-   Testing samples: 175,341

The dataset contains network-traffic features representing normal and
malicious activity.

The same underlying dataset and problem definition are used when
constructing the quantum-compatible representation. This allows the
initial QML work to be compared against the established classical
machine-learning baseline.

------------------------------------------------------------------------

# 4. Feature Analysis and Preprocessing

The preprocessing stage investigated the structure of the UNSW-NB15
features, including:

-   Numerical feature distributions
-   Feature skewness
-   Categorical variables
-   Scaling requirements
-   Feature transformations
-   Redundant or low-information features
-   Zero-IQR features
-   Transformation requirements for machine-learning models

The selected preprocessing configuration is referred to as **Variant
E**.

The current Variant E representation consists of:

``` text
26 Numerical Features
+
3 Categorical Features
-----------------------
177 Transformed Features
```

The preprocessing pipeline performs the required numerical
transformations, categorical encoding, scaling, and feature preparation.

The fitted preprocessing pipeline is stored as a reusable artifact and
is used by the backend inference system together with the trained Random
Forest model.

------------------------------------------------------------------------

# 5. Classical Intrusion Detection

## 5.1 Model Selection

Multiple classical machine-learning approaches were investigated as part
of the baseline model-selection process.

XGBoost and LightGBM were competitive with the selected Random Forest:

``` text
XGBoost       F1 ≈ 0.9321
LightGBM      F1 ≈ 0.9320
Random Forest F1 = 0.9335
```

Hyperparameter optimization did not produce a meaningful improvement
over the selected Random Forest baseline.

Random Forest was therefore retained as the current classical IDS model.

------------------------------------------------------------------------

## 5.2 Random Forest Configuration

The production classical IDS uses the selected Random Forest
configuration with:

``` text
Model: Random Forest
Number of trees: 200
Preprocessing: Variant E
Input representation: 177 transformed features
```

The trained model and preprocessing pipeline are stored as reusable
artifacts and loaded by the backend prediction service.

------------------------------------------------------------------------

## 5.3 Classical IDS Results

The Random Forest was evaluated on the held-out UNSW-NB15 evaluation
data.

  Metric           Result
  -------------- --------
  Accuracy         0.9136
  Precision        0.9804
  Recall / TPR     0.8909
  F1-score         0.9335
  ROC-AUC          0.9825

A normal-only evaluation produced:

``` text
Normal samples evaluated: 56,000
Correctly classified normal samples: 53,882
False positives: 2,118
Observed FPR: approximately 3.78%
Specificity: approximately 96.22%
```

False-positive rate is particularly important for the eventual AEGES-Q
adaptive-security architecture because threat assessments are intended
to influence security policy.

A lower decision threshold can increase attack detection but may
increase false alarms. A higher threshold can reduce false alarms while
increasing missed attacks. Therefore, threshold selection is treated as
an operational trade-off rather than a single universally optimal value.

------------------------------------------------------------------------

# 6. Classical Cryptographic Research

The cryptographic baseline separates key establishment from bulk data
protection.

The current classical cryptographic layer uses:

``` text
X25519
   |
   v
Shared Secret
   |
   v
HKDF-SHA256
   |
   v
32-byte Session Key
   |
   v
AES-256-GCM
   |
   v
Authenticated Ciphertext
```

## 6.1 AES-256-GCM

AES-256-GCM is used as the authenticated symmetric encryption primitive.

The implementation provides:

-   Confidentiality
-   Integrity
-   Authentication
-   Fresh nonce generation
-   Associated-data authentication
-   Authentication-tag verification

The implementation generates a fresh 12-byte nonce for each encryption
operation and uses a 256-bit AES key.

The authentication tag is 16 bytes.

The implementation rejects invalid authentication tags during
decryption.

------------------------------------------------------------------------

## 6.2 X25519 + HKDF-SHA256

X25519 is used for ephemeral classical key establishment.

The flow is:

``` text
Client ephemeral private/public key
                |
                v
       X25519 key agreement
                |
                v
         Shared secret
                |
                v
          HKDF-SHA256
                |
                v
       32-byte session key
```

The implementation generates ephemeral X25519 key pairs, serializes
public keys, performs key agreement, and derives a 32-byte session key
using HKDF-SHA256.

------------------------------------------------------------------------

## 6.3 Cryptographic Benchmark Results

The classical cryptography benchmark evaluated key generation, key
agreement, key derivation, encryption, decryption, throughput, and
ciphertext overhead.

  Operation                              Median / Reference Result
  ---------------------------------- -----------------------------
  AES-256-GCM encryption               \~0.323 ms aggregate median
  AES-256-GCM decryption               \~0.317 ms aggregate median
  X25519 + HKDF-SHA256                                   0.6148 ms
  X25519 key generation                                 0.19335 ms
  X25519 shared-secret computation                       0.1600 ms
  HKDF-SHA256                                            0.0166 ms

AES-GCM was benchmarked using payload sizes of:

``` text
1 KB
4 KB
16 KB
64 KB
1 MB
```

Measured encryption throughput ranged approximately from:

``` text
~271 MB/s at 1 KB
~1.81 GB/s at 64 KB
~819 MB/s at 1 MB
```

AES-GCM introduces a fixed 16-byte authentication tag.

All benchmark timings are local reference measurements and are
hardware-dependent. They should not be interpreted as universal
performance guarantees.

------------------------------------------------------------------------

# 7. Classical Cryptographic Backend

The cryptographic research has been translated into backend services.

The backend currently contains services for:

``` text
AES-256-GCM
X25519
HKDF-SHA256
Session establishment
Session-based encryption
```

The backend supports an end-to-end flow in which:

1.  A client generates an X25519 public key.
2.  The public key is submitted to the session endpoint.
3.  The server generates an ephemeral X25519 key pair.
4.  The server performs X25519 key agreement.
5.  HKDF-SHA256 derives the session key.
6.  A session identifier is returned.
7.  The session is used for encryption.
8.  AES-256-GCM encrypts the supplied plaintext.
9.  The API returns the authenticated ciphertext and nonce in Base64
    form.

This end-to-end flow has been successfully verified.

### Current infrastructure limitation

Session state is currently stored in an in-memory dictionary.

Therefore, the current prototype does not yet provide:

-   Persistent session storage
-   Session expiry
-   Session revocation
-   Distributed backend operation
-   Production-grade persistence

These are later hardening tasks.

------------------------------------------------------------------------

# 8. Initial Quantum Machine Learning Research

The QML work is currently an experimental research component.

The objective is not to claim quantum advantage at this stage. The
purpose of the initial experiments is to establish a functioning quantum
machine-learning pipeline and obtain a measurable baseline that can
later be compared against larger simulations and quantum-hardware
experiments.

The initial work validated:

-   Single-qubit RY rotations
-   Two-qubit H + CNOT entanglement
-   Classical feature encoding
-   Trainable variational circuits
-   Quantum-circuit execution using a local simulator
-   Quantum-machine-learning optimization

The current local environment used:

``` text
Python       3.13.7
Qiskit       2.5.2
Qiskit Aer   0.17.2
Qiskit ML    0.9.1
```

The initial experiments use Qiskit Aer local simulation rather than a
physical quantum processor.

------------------------------------------------------------------------

# 9. QML Data Reduction

The full classical preprocessing representation contains 177 transformed
features.

A direct 177-feature quantum representation would require substantially
more quantum resources than are available in the current local
experimental environment.

Therefore, PCA was applied to the training representation.

The current benchmark uses:

``` text
177 transformed features
        |
        v
       PCA
        |
        v
4 principal components
        |
        v
4-qubit quantum representation
```

PCA was fitted only on the training data.

The selected four principal components explained approximately:

``` text
45.64% of training variance
```

The resulting features were scaled to `[0, 1]` and encoded as rotation
angles using:

``` text
angle = feature × π
```

------------------------------------------------------------------------

# 10. QML Circuit Research

Several quantum-circuit concepts were investigated before the benchmark.

The selected experimental direction uses:

``` text
Feature Encoding
       |
       v
Trainable Rotations
       |
       v
Entanglement
       |
       v
Measurement
```

The benchmarked Circuit C combines feature encoding, trainable
rotations, and entanglement.

The purpose of the circuit is to investigate whether a small variational
quantum model can learn a useful classification boundary from the
reduced UNSW-NB15 representation.

------------------------------------------------------------------------

# 11. Initial QML Benchmark

The current benchmark was deliberately constrained to remain executable
on the available local hardware.

  Setting                          Value
  ---------------------- ---------------
  Training subset                  2,000
  Validation subset                1,000
  Held-out test subset             2,000
  PCA components                       4
  Qubits                               4
  Optimization                BCE + SPSA
  Iterations                          20
  Shots                              256
  Learning rate                     0.10
  SPSA perturbation                 0.08
  Training time            \~616 seconds

The raw QML output required polarity handling.

Validation threshold calibration therefore used an explicit
false-positive-rate constraint rather than unconstrained F1
optimization.

At the selected validation operating point:

``` text
Maximum validation FPR constraint: 10%
Threshold: 0.55
Precision: 0.9410
Recall: 0.6094
F1: 0.7398
FPR: 0.0815
```

------------------------------------------------------------------------

# 12. Held-Out QML Results

The final held-out Circuit C result was:

  Metric           Result
  -------------- --------
  Accuracy         0.6770
  Precision        0.9162
  Recall / TPR     0.5783
  F1-score         0.7090
  ROC-AUC          0.7204
  FPR              0.1127

Confusion-matrix counts were:

``` text
TN = 567
FP = 72
FN = 574
TP = 787
```

These results are treated as an **initial constrained QML baseline**.

They are not interpreted as evidence that quantum machine learning is
inherently inferior to classical machine learning.

The experiment is constrained by:

-   Four-dimensional PCA representation
-   Four qubits
-   Small training subset
-   Small validation subset
-   Small held-out subset
-   Shallow circuit structure
-   20 optimization iterations
-   256 shots
-   Local CPU-based simulation

These limitations substantially restrict the model capacity, search
space, and computational budget.

------------------------------------------------------------------------

# 13. Why the QML Result Is a Baseline

The current QML experiment exists primarily to establish the research
pipeline.

The current result should therefore be interpreted as:

``` text
Classical baseline
        |
        v
Established and operational

QML baseline
        |
        v
Validated under local resource constraints

Quantum scaling
        |
        v
Requires higher-compute / quantum-lab environment
```

A meaningful QML study requires broader experimentation involving more
features, more qubits, larger datasets, more shots, deeper or
alternative circuit architectures, repeated runs, and broader
optimization.

Those experiments are outside the current local-compute baseline.

------------------------------------------------------------------------

# 14. Current Backend

AEGES-Q contains a FastAPI backend that exposes the completed classical
IDS and cryptographic functionality.

The backend currently provides three primary areas of functionality:

``` text
1. IDS Prediction
2. Cryptographic Session Establishment
3. Session-Based Encryption
```

Conceptually:

``` text
                  FastAPI Backend
                        |
        +---------------+---------------+
        |               |               |
        v               v               v
   IDS Service     Crypto Services   API Routes
        |               |
        |         +-----+------+
        |         |            |
        v         v            v
 Random Forest  X25519       AES-GCM
        |
        v
 Threat Prediction
```

------------------------------------------------------------------------

# 15. Backend Components

The backend is organized around API routes and service modules.

The important components are:

``` text
app/
└── backend/
    ├── main.py
    ├── api/
    ├── routes.py
    └── services/
        ├── classical_service.py
        └── quantum_service.py
```

### `main.py`

The FastAPI application entry point.

It initializes the backend application and connects the API routing
layer.

### `routes.py`

Contains the API route definitions.

The routes connect incoming API requests to the relevant prediction and
cryptographic services.

### `services/classical_service.py`

Contains the classical machine-learning and classical cryptographic
service logic.

The classical IDS portion loads the stored preprocessing and Random
Forest artifacts and performs inference.

The cryptographic portion provides the classical cryptographic
operations used by the backend.

### `services/quantum_service.py`

Provides the service boundary for the quantum-related portion of the
architecture.

The current QML research itself remains primarily
experimental/notebook-based and is not claimed as a completed production
quantum detector.

------------------------------------------------------------------------

# 16. Running the Backend

## 16.1 Requirements

The project uses Python and a project virtual environment.

For the QML research environment, the validated environment included:

``` text
Python 3.13.7
Qiskit 2.5.2
Qiskit Aer 0.17.2
Qiskit Machine Learning 0.9.1
```

The classical backend additionally requires the project's Python
dependencies, including the cryptography and FastAPI stack.

------------------------------------------------------------------------

## 16.2 Create the Virtual Environment

From the project root:

``` bash
python -m venv .venv
```

Activate it on Windows:

``` powershell
.venv\Scripts\Activate.ps1
```

If using Command Prompt:

``` cmd
.venv\Scripts\activate
```

------------------------------------------------------------------------

## 16.3 Install Dependencies

Install the project dependencies using:

``` bash
pip install -r requirements.txt
```

If the QML environment is being recreated separately, the quantum
research dependencies include:

``` bash
pip install qiskit qiskit-aer qiskit-machine-learning numpy pandas matplotlib scikit-learn pylatexenc
```

------------------------------------------------------------------------

## 16.4 Start the FastAPI Backend

From the project root, start the FastAPI application with:

``` bash
uvicorn app.backend.main:app --reload
```

The backend will normally become available at:

``` text
http://127.0.0.1:8000
```

FastAPI's automatically generated interactive API documentation can be
accessed at:

``` text
http://127.0.0.1:8000/docs
```

The OpenAPI schema is available at:

``` text
http://127.0.0.1:8000/openapi.json
```

If the project uses a different entry point in the current checkout, use
the corresponding module path defined by `app/backend/main.py`.

------------------------------------------------------------------------

# 17. Backend Usage Flow

## 17.1 IDS Prediction

The IDS prediction flow is:

``` text
Client Request
      |
      v
FastAPI Route
      |
      v
Input Feature Processing
      |
      v
Variant E Preprocessor
      |
      v
Random Forest
      |
      v
Prediction + Confidence
```

The backend loads the stored preprocessing pipeline and Random Forest
model rather than retraining the model for every request.

------------------------------------------------------------------------

## 17.2 Cryptographic Session Establishment

The cryptographic session flow is:

``` text
Client
  |
  | X25519 public key
  v
Session Endpoint
  |
  | Server ephemeral key generation
  v
X25519 Key Agreement
  |
  v
Shared Secret
  |
  v
HKDF-SHA256
  |
  v
32-byte Session Key
  |
  v
Session Identifier
```

The server returns its public key and a session identifier.

The current prototype stores the resulting session information in
memory.

------------------------------------------------------------------------

## 17.3 Session-Based Encryption

Once a session has been established:

``` text
Plaintext
    |
    v
Session Key
    |
    v
AES-256-GCM
    |
    +----> Fresh 12-byte nonce
    |
    +----> Authentication tag
    |
    v
Base64 Encoded Ciphertext
```

The end-to-end flow has been tested successfully.

The observed response includes a Base64-encoded nonce and authenticated
ciphertext.

------------------------------------------------------------------------

# 18. Project Structure

The project is organized into application code, research artifacts,
configuration, datasets, notebooks, results, and tests.

A representative structure is:

``` text
AEGES-Q/
│
├── app/
│   └── backend/
│       ├── api/
│       ├── main.py
│       ├── routes.py
│       └── services/
│           ├── classical_service.py
│           └── quantum_service.py
│
├── artifacts/
│   ├── classical/
│   └── quantum/
│
├── configs/
│   ├── classical.yaml
│   ├── preprocessing.yaml
│   └── quantum.yaml
│
├── data/
│   └── raw/
│       └── UNSW-NB15 dataset files
│
├── docs/
│
├── notebooks/
│   ├── 01_eda/
│   ├── classical/
│   ├── cryptography/
│   └── quantum/
│
├── results/
│
├── src/
│
├── tests/
│
├── .gitignore
├── LICENSE
├── README.md
└── requirements.txt
```

The exact contents can change as the research implementation develops.

------------------------------------------------------------------------

# 19. Research Artifacts

Important research artifacts currently include:

### Classical IDS

-   Trained Random Forest model
-   Fitted preprocessing pipeline
-   Classical evaluation results
-   Model-selection results

### Classical Cryptography

-   AES-256-GCM benchmark results
-   X25519 benchmark results
-   HKDF-SHA256 benchmark results
-   Cryptographic benchmark CSV outputs
-   End-to-end API verification

### Quantum Machine Learning

-   QML experiment notebooks
-   Quantum circuit experiments
-   PCA-reduced feature representation
-   QML benchmark result CSV
-   Circuit C evaluation results

Hardware-dependent measurements are local reference measurements and
should be interpreted in the context of the environment in which they
were obtained.

------------------------------------------------------------------------

# 20. Research Methodology

The project follows a staged research methodology.

## Stage 1: Classical Baseline

First, a conventional network intrusion-detection pipeline was
established using UNSW-NB15.

This stage provides:

-   A reproducible dataset
-   A defined preprocessing pipeline
-   A measurable machine-learning baseline
-   Evaluation metrics
-   A production inference artifact

------------------------------------------------------------------------

## Stage 2: Classical Cryptographic Baseline

The cryptographic layer was established independently of the quantum
research.

The baseline uses:

``` text
X25519
+
HKDF-SHA256
+
AES-256-GCM
```

This establishes measurable classical performance before introducing
future PQC alternatives.

------------------------------------------------------------------------

## Stage 3: Initial QML Research

The quantum component was developed incrementally.

The research sequence was:

``` text
Quantum operations
        |
        v
Quantum feature encoding
        |
        v
Entanglement
        |
        v
Trainable variational circuits
        |
        v
PCA-based feature reduction
        |
        v
4-qubit QML benchmark
        |
        v
Held-out evaluation
```

The current QML experiment therefore serves as a baseline for future
higher-resource experiments.

------------------------------------------------------------------------

# 21. Current Limitations

The current implementation has several explicit limitations.

## 21.1 QML Compute Constraints

The local QML experiment is limited by CPU-based simulation.

The current benchmark uses only four qubits and a small subset of the
complete dataset.

Larger experiments are expected to require higher computational
resources or access to the quantum laboratory.

------------------------------------------------------------------------

## 21.2 No Physical Quantum Execution Yet

The current QML results were obtained using Qiskit Aer local simulation.

They do not represent measurements from a physical quantum processor.

------------------------------------------------------------------------

## 21.3 QML Is Not Yet the Production IDS

The current production IDS remains the classical Random Forest system.

The QML work is currently a research baseline and has not been presented
as a replacement for the classical detector.

------------------------------------------------------------------------

## 21.4 No PQC Benchmark Yet

Post-quantum cryptographic algorithms have not yet been benchmarked in
the current implementation.

The classical cryptographic benchmark provides the reference point for
that future work.

------------------------------------------------------------------------

## 21.5 Adaptive Policy Integration Is Not Complete

The architecture defines Normal, Elevated, High, and Critical security
states.

However, the complete automatic pipeline:

``` text
Threat Prediction
        |
        v
Severity Classification
        |
        v
Adaptive Policy Selection
        |
        v
Classical / Hybrid / PQC Cryptographic Configuration
```

is not yet fully implemented as a production subsystem.

------------------------------------------------------------------------

## 21.6 Backend Persistence

The current backend stores cryptographic session information in memory.

Restarting the backend therefore removes active sessions.

A persistent database and session-management layer are required for
durable deployment.

------------------------------------------------------------------------

# 22. Current Research Conclusions

The work completed so far establishes three important foundations for
AEGES-Q.

### Classical IDS Foundation

A reproducible UNSW-NB15 preprocessing pipeline and Random Forest
intrusion-detection baseline have been established.

The current held-out result is:

``` text
Accuracy : 0.9136
Precision: 0.9804
Recall   : 0.8909
F1       : 0.9335
ROC-AUC  : 0.9825
```

### Classical Cryptographic Foundation

A complete classical cryptographic baseline has been established using:

``` text
X25519
HKDF-SHA256
AES-256-GCM
```

The cryptographic operations have been benchmarked and integrated into
the backend.

### Initial Quantum Research Foundation

The QML pipeline has been successfully demonstrated using local
simulation.

A four-qubit Circuit C benchmark has produced measurable held-out
classification results.

The current result is explicitly treated as a constrained baseline
because the local environment limits the size and complexity of the
quantum experiments.

------------------------------------------------------------------------

# 23. Work Remaining After the Current Stage

The next research stages are:

``` text
Current Stage
     |
     v
Higher-Compute / Quantum-Lab QML Experiments
     |
     v
Larger Feature and Qubit Configurations
     |
     v
Repeated QML Experiments and Broader Optimization
     |
     v
PQC Benchmarking
     |
     v
Classical vs PQC Comparison
     |
     v
Hybrid Key Establishment Research
     |
     v
Adaptive Policy Integration
     |
     v
End-to-End AEGES-Q Evaluation
```

These items are future research work and are not represented as
completed functionality in the current implementation.

------------------------------------------------------------------------

# 24. Important Interpretation of the Current Results

AEGES-Q is currently a research prototype with a completed classical
security foundation and an initial quantum machine-learning baseline.

The current results demonstrate that:

1.  The UNSW-NB15 data can be processed through the selected Variant E
    preprocessing pipeline.
2.  A classical Random Forest IDS can provide a strong measurable
    baseline.
3.  Classical cryptographic primitives can be benchmarked and exposed
    through backend services.
4.  X25519 and HKDF-SHA256 can be used to establish session keys.
5.  AES-256-GCM can provide authenticated application-data encryption.
6.  Quantum feature encoding and trainable circuits can be executed
    locally using Qiskit Aer.
7.  A constrained four-qubit QML classifier can be trained and evaluated
    on a reduced representation of the UNSW-NB15 problem.
8.  The current QML experiment is computationally constrained and
    requires further experimentation before any conclusion about
    larger-scale QML performance can be made.

The project therefore treats the classical system as the established
baseline and the current QML implementation as the starting point for
further quantum-security research.

------------------------------------------------------------------------

# 25. Reproducibility

The research results should be interpreted together with their
experimental configuration.

In particular:

-   Dataset split must remain consistent.
-   Preprocessing must be fitted only on training data where applicable.
-   Random seeds should be retained.
-   Hardware-dependent timing results should be treated as local
    measurements.
-   QML simulator results should not be interpreted as physical
    quantum-hardware results.
-   The current QML experiment should be described together with its
    qubit count, PCA dimensionality, sample sizes, shot count,
    optimizer, and iteration budget.

This is especially important when comparing future experiments against
the current baseline.

------------------------------------------------------------------------

# 26. Project Status at This Revision

At the current revision, AEGES-Q has:

``` text
[COMPLETE]
UNSW-NB15 preprocessing
Classical ML IDS
Random Forest baseline
Classical cryptographic benchmark
AES-256-GCM implementation
X25519 + HKDF implementation
FastAPI backend integration
End-to-end classical crypto API verification
Initial QML circuit research
Initial QML benchmark

[IN PROGRESS / NEXT RESEARCH STAGE]
Higher-compute QML experiments
Quantum-lab experiments
PQC research
Adaptive policy integration

[NOT YET CLAIMED]
Production-ready quantum IDS
Production-ready PQC layer
Complete adaptive cryptographic policy engine
Full quantum/PQC end-to-end system
```

------------------------------------------------------------------------

# 27. License

See the `LICENSE` file included in the repository.

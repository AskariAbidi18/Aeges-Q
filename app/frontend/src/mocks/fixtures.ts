import type { Provenance } from '../types/provenance';
export const idsMetrics = { accuracy: 0.9136, precision: 0.9804, recall: 0.8909, f1: 0.9335, rocAuc: 0.9825, normalFpr: 0.0378 };
export const qmlMetrics = { accuracy: 0.677, precision: 0.9162, recall: 0.5783, f1: 0.709, rocAuc: 0.7204, fpr: 0.1127 };
export const cryptoRef = [
  { name: 'AES-GCM median encryption', value: '≈ 0.323 ms' },
  { name: 'AES-GCM median decryption', value: '≈ 0.317 ms' },
  { name: 'X25519 + HKDF session-key establishment', value: '≈ 0.6148 ms' },
];
export const pipeline: { name: string; state: Provenance; note: string }[] = [
  { name: 'Variant E preprocessing', state: 'implemented', note: 'Feature preparation for the IDS' },
  { name: 'Classical Random Forest IDS', state: 'implemented', note: 'Offline-evaluated classifier' },
  { name: 'QML research path', state: 'experimental', note: 'Not wired as a live service' },
  { name: 'Adaptive policy engine', state: 'planned', note: 'Threat-driven crypto policy' },
  { name: 'X25519 + HKDF-SHA256', state: 'implemented', note: 'Session establishment' },
  { name: 'ML-KEM-768 / PQC', state: 'pending', note: 'Pending implementation and evaluation' },
  { name: 'AES-256-GCM', state: 'implemented', note: 'Authenticated encryption' },
];
export const experiments = [
  { id: 'EXP-IDS', what: 'Random Forest IDS, Variant E, held-out set', result: 'F1 0.9335 · ROC-AUC 0.9825', state: 'historical' as Provenance },
  { id: 'EXP-QML', what: 'QML Circuit C, four-qubit local simulator', result: 'F1 0.7090 · ROC-AUC 0.7204', state: 'historical' as Provenance },
  { id: 'EXP-AEAD', what: 'AES-GCM local timing reference', result: 'Median enc ≈ 0.323 ms', state: 'historical' as Provenance },
  { id: 'EXP-PQC', what: 'ML-KEM-768 benchmark', result: 'No results yet', state: 'pending' as Provenance },
];
export const sampleFlow = { duration: '0.12', spkts: '14', dpkts: '10', sbytes: '1840', dbytes: '2210', rate: '180', sttl: '62', proto: 'tcp' };
export const handshakeSteps = [
  { id: 'cpk', title: 'Client ephemeral public key', body: 'The client generates a temporary X25519 key pair and sends only the public key. The private key never leaves the client.' },
  { id: 'spk', title: 'Server ephemeral public key', body: 'The server does the same and replies with its public key. Only public values cross the network.' },
  { id: 'dh', title: 'Shared-secret derivation', body: 'Each side combines its own private key with the peer public key. Both arrive at the same secret without transmitting it.' },
  { id: 'hkdf', title: 'HKDF-derived session key', body: 'HKDF-SHA256 turns the shared secret into a fixed-length session key suitable for AES-256-GCM.' },
  { id: 'aead', title: 'AES-256-GCM payload protection', body: 'Payloads are encrypted with a fresh nonce and carry an authentication tag, so tampering is detected on decryption.' },
];

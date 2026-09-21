from pydantic import BaseModel

class PredictionRequest(BaseModel):
    dur: float
    sbytes: float
    dbytes: float
    rate: float
    sttl: float
    dttl: float
    sload: float
    dload: float
    sinpkt: float
    dinpkt: float
    sjit: float
    djit: float
    swin: float
    stcpb: float
    dtcpb: float
    tcprtt: float
    synack: float
    ackdat: float
    smean: float
    dmean: float
    trans_depth: float
    response_body_len: float
    ct_state_ttl: float
    ct_dst_sport_ltm: float
    ct_src_dport_ltm: float
    ct_srv_dst: float
    is_ftp_login: float
    ct_flw_http_mthd: float
    proto: str
    service: str
    state: str

class CryptoSessionRequest(BaseModel):
    client_public_key: str


class CryptoSessionResponse(BaseModel):
    session_id: str
    server_public_key: str


class CryptoEncryptRequest(BaseModel):
    session_id: str
    plaintext: str


class CryptoEncryptResponse(BaseModel):
    nonce: str
    ciphertext: str

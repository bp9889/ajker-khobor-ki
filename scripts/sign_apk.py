#!/usr/bin/env python3
"""Sign an Android app file with APK Signature Scheme v2 (enough for Android 7.0+, the app's minSdk 24).

    python3 scripts/sign_apk.py unsigned.apk signed.apk key.p12 <p12 password file>

The key is the app's own signing key, exported from the keystore as PKCS#12. Never commit the key.
Check the result with:  python3 -m apksigtool verify signed.apk   (pip install apksigtool)
"""
import hashlib
import struct
import sys

from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import padding
from cryptography.hazmat.primitives.serialization import pkcs12

RSA_PKCS1_SHA256 = 0x0103
V2_BLOCK_ID = 0x7109871A
CHUNK = 1024 * 1024


def lp(b):  # uint32 length-prefixed bytes
    return struct.pack('<I', len(b)) + b


def find_eocd(data):
    for i in range(len(data) - 22, max(-1, len(data) - 22 - 65536), -1):
        if data[i:i + 4] == b'PK\x05\x06':
            return i
    raise SystemExit('not a zip file')


def chunk_digest(sections):
    digests = []
    for sec in sections:
        for o in range(0, len(sec), CHUNK):
            c = sec[o:o + CHUNK]
            digests.append(hashlib.sha256(b'\xa5' + struct.pack('<I', len(c)) + c).digest())
    return hashlib.sha256(b'\x5a' + struct.pack('<I', len(digests)) + b''.join(digests)).digest()


def check_alignment(data, cd_off, cd_size):
    # Uncompressed files (resources.arsc and others) must start on a 4-byte boundary for Android 11+.
    p = cd_off
    while p < cd_off + cd_size:
        method, = struct.unpack('<H', data[p + 10:p + 12])
        nlen, elen, clen = struct.unpack('<HHH', data[p + 28:p + 34])
        lho, = struct.unpack('<I', data[p + 42:p + 46])
        name = data[p + 46:p + 46 + nlen].decode('utf-8', 'replace')
        if method == 0:
            ln, le = struct.unpack('<HH', data[lho + 26:lho + 30])
            start = lho + 30 + ln + le
            if start % 4:
                raise SystemExit('not aligned: ' + name + ' (run zipalign first)')
        p += 46 + nlen + elen + clen


def main(src, dst, p12_path, pw_path):
    data = open(src, 'rb').read()
    eocd = find_eocd(data)
    cd_size, cd_off = struct.unpack('<II', data[eocd + 12:eocd + 20])
    if data[cd_off - 16:cd_off] == b'APK Sig Block 42':
        raise SystemExit('already signed')
    check_alignment(data, cd_off, cd_size)

    pw = open(pw_path, 'rb').read().strip()
    key, cert, _ = pkcs12.load_key_and_certificates(open(p12_path, 'rb').read(), pw)
    cert_der = cert.public_bytes(serialization.Encoding.DER)
    pub_der = key.public_key().public_bytes(serialization.Encoding.DER, serialization.PublicFormat.SubjectPublicKeyInfo)

    digest = chunk_digest([data[:cd_off], data[cd_off:cd_off + cd_size], data[eocd:]])
    signed_data = (lp(lp(struct.pack('<I', RSA_PKCS1_SHA256) + lp(digest)))
                   + lp(lp(cert_der))
                   + lp(b''))
    sig = key.sign(signed_data, padding.PKCS1v15(), hashes.SHA256())
    signer = lp(signed_data) + lp(lp(struct.pack('<I', RSA_PKCS1_SHA256) + lp(sig))) + lp(pub_der)
    v2 = lp(lp(signer))

    pair = struct.pack('<Q', 4 + len(v2)) + struct.pack('<I', V2_BLOCK_ID) + v2
    size = len(pair) + 8 + 16
    block = struct.pack('<Q', size) + pair + struct.pack('<Q', size) + b'APK Sig Block 42'

    new_eocd = bytearray(data[eocd:])
    struct.pack_into('<I', new_eocd, 16, cd_off + len(block))
    open(dst, 'wb').write(data[:cd_off] + block + data[cd_off:cd_off + cd_size] + bytes(new_eocd))
    print('signed', dst, 'cert sha256', hashlib.sha256(cert_der).hexdigest())


if __name__ == '__main__':
    if len(sys.argv) != 5:
        raise SystemExit(__doc__)
    main(*sys.argv[1:])

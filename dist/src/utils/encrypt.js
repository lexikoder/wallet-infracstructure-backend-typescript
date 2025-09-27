"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrypt = encrypt;
exports.decrypt = decrypt;
const crypto_1 = __importDefault(require("crypto"));
// Must be 16 bytes for CBC mode
const iv = crypto_1.default.randomBytes(16);
const ENCRYPT_KEY = process.env.ENCRYPT_KEY;
if (!ENCRYPT_KEY) {
    throw new Error('ENCRYPT_KEY is missing');
}
const secretKey = Buffer.from(ENCRYPT_KEY, 'hex');
function encrypt(text) {
    const cipher = crypto_1.default.createCipheriv('aes-256-cbc', secretKey, iv);
    const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
    return {
        iv: iv.toString('hex'),
        encryptedkey: encrypted.toString('hex'),
    };
}
function decrypt(encryptedData) {
    const decipher = crypto_1.default.createDecipheriv('aes-256-cbc', secretKey, Buffer.from(encryptedData.iv, 'hex'));
    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encryptedData.encryptedkey, 'hex')),
        decipher.final(),
    ]);
    return decrypted.toString('utf8');
}

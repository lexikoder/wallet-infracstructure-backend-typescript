import crypto from 'crypto'
// Must be 16 bytes for CBC mode
const iv = crypto.randomBytes(16);
const ENCRYPT_KEY =process.env.ENCRYPT_KEY

if (!ENCRYPT_KEY) {
  throw new Error('ENCRYPT_KEY is missing');
}

const secretKey = Buffer.from(ENCRYPT_KEY, 'hex')
  
function encrypt(text:any) {
  const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  return {
    iv: iv.toString('hex'),
    encryptedkey: encrypted.toString('hex'),
  };
}
  
function decrypt(encryptedData:any) {
  const decipher = crypto.createDecipheriv(  
    'aes-256-cbc',
    secretKey,
    Buffer.from(encryptedData.iv, 'hex')
  );
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encryptedData.encryptedkey, 'hex')),
    decipher.final(),
  ]);  
  return decrypted.toString('utf8');
}

export  {encrypt,decrypt}


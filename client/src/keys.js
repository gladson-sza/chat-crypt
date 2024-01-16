import forge from 'node-forge';

const generateSSHKeyPair = (userId) => {
  const keypair = forge.pki.rsa.generateKeyPair({ bits: 1024 });
  const privateKey = forge.pki.privateKeyToPem(keypair.privateKey);
  const publicKey = forge.pki.publicKeyToPem(keypair.publicKey);

  localStorage.setItem(`key.private.${userId}`, privateKey);
  localStorage.setItem(`key.public.${userId}`, publicKey); // Fix: store publicKey instead of privateKey

  return { privateKey, publicKey };
};

const getPrivateKey = (userId) => {
  let key = localStorage.getItem(`key.private.${userId}`);

  if (key === null) {
    const { privateKey } = generateSSHKeyPair(userId); // Fix: pass userId to generateSSHKeyPair
    key = privateKey;
  }

  return key;
};

const getPublicKey = (userId) => {
  let key = localStorage.getItem(`key.public.${userId}`);

  if (key === null) {
    const { publicKey } = generateSSHKeyPair(userId); // Fix: pass userId to generateSSHKeyPair
    key = publicKey;
  }

  return key;
};

const generateRandomKey = () => {
  const byteBuffer = forge.random.getBytesSync(16);
  const randomKey = forge.util.bytesToHex(byteBuffer);
  return randomKey;
}

const saveChatKey = (userId, chatId, key) => {
  localStorage.setItem(`key.user${userId}.chat.${chatId}`, key);
}

const getChatKey = (userId, chatId) => {
  return localStorage.getItem(`key.user${userId}.chat.${chatId}`);
}

const saveContactPubKey = (id, key) => {
  localStorage.setItem(`key.user${id}.public`, key);
}

const getContactPubKey = (id) => {
  return localStorage.setItem(`key.user${id}.public`, key);
}

function encryptWithPublicKey(publicKey, data) {
  const publicKeyObject = forge.pki.publicKeyFromPem(publicKey);
  const encrypted = publicKeyObject.encrypt(forge.util.encodeUtf8(data));
  return forge.util.encode64(encrypted);
}

function decryptWithPrivateKey(privateKey, encryptedData) {
  const privateKeyObject = forge.pki.privateKeyFromPem(privateKey);
  const decrypted = privateKeyObject.decrypt(forge.util.decode64(encryptedData));
  return forge.util.decodeUtf8(decrypted);
}


export { getPrivateKey, getPublicKey, generateRandomKey, saveChatKey, getChatKey, saveContactPubKey, getContactPubKey, encryptWithPublicKey, decryptWithPrivateKey };

import forge from 'node-forge';

const generateSSHKeyPair = (userId) => {
  const keypair = forge.pki.rsa.generateKeyPair({ bits: 2048 });
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

export { getPrivateKey, getPublicKey, silentGenerateKeyPair };

import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;

export const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

export const decryptData = (ciphertext) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
};

export const setEncryptedItem = (key, data) => {
  const encryptedData = encryptData(data);
  localStorage.setItem(key, encryptedData);
};

export const getDecryptedItem = (key) => {
  const encryptedData = localStorage.getItem(key);
  return encryptedData ? decryptData(encryptedData) : null;
};

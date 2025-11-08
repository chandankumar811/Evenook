import crypto from "crypto";

// export const generateUniqueId = (username) => {
//     const sanitizedUsername = username.replace(/\s+/g, "").toLowerCase();
//     const randomString = crypto.randomBytes(2).toString("hex");
//     const timestamp = Date.now().toString(36);

//     return `${sanitizedUsername}-${randomString}-${timestamp}`;
// };

export const generateUniqueId = (length) => {
    const chars = 'abcefghikmnstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
      randomString += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return randomString;
  };
/**
 * OTP helpers for verification flows.
 */
export const generateOtp = (length = 6): string => {
  let otp = '';
  for (let i = 0; i < length; i += 1) {
    otp += Math.floor(Math.random() * 10).toString();
  }
  return otp;
};

export const maskOtp = (otp: string): string => otp.replace(/./g, '•');

export const isValidOtp = (otp: string, length = 6): boolean =>
  new RegExp(`^\\d{${length}}$`).test(otp.trim());

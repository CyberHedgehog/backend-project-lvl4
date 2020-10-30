import crypto from 'crypto';

export default (value) => {
  const secret = process.env.CRYPTOWORD;
  return crypto.createHmac('sha256', secret)
    .update(value)
    .digest('hex');
};

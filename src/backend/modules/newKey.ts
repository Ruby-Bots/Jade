export interface Options {
  includeDots: boolean;
}

const genNewKey = async (length: number = 25, options?: Options) => {
  let chars = "QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm12345678901234567890QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm12345678901234567890QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm12345678901234567890QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm12345678901234567890QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm12345678901234567890";
  if (options.includeDots) { 
    chars = "QWERTY.UIOP.ASDFG..HJKLZXC.VBNMqwer.yuiopasdf.ghjklzx..cvbnm.12345..6.78901234567890QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm12345678901234567890QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm12345678901234567890QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjk.lz.xcvbn.m12345..67890123.4567890.QWERTYU.IO.PASDFGHJKLZX..VBNMqwertyuio.a.sdfghjklzxcvb.m123456.78901234567890";
  }
  let str = "";
  for (let i = 0; i < length; i++) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str;
};

export default genNewKey;

const CryptoMethods = {
  aes: () => import("./aes"),
};

const runtime = (opt: {
  buffer: ArrayBuffer;
  slots: {
    init: HTMLImageElement;
    encrypted: HTMLImageElement;
    decrypted: HTMLImageElement;
  };
  methods: keyof typeof CryptoMethods;
}) => {};

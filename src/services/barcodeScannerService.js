import Quagga from 'quagga';

let isInitialized = false;
let detectedHandler = null;

const init = (target) =>
  new Promise((resolve, reject) => {
    Quagga.init(
      {
        inputStream: {
          type: 'LiveStream',
          target,
          constraints: {
            width: 640,
            height: 480,
            facingMode: 'environment',
          },
        },
        decoder: {
          readers: ['code_128_reader'],
        },
        locate: true,
      },
      (error) => {
        if (error) {
          reject(error);
          return;
        }
        isInitialized = true;
        resolve();
      }
    );
  });

const start = async ({ target, onDetected }) => {
  if (!target) {
    throw new Error('Scanner target element not available.');
  }

  if (!isInitialized) {
    await init(target);
  }

  if (detectedHandler) {
    Quagga.offDetected(detectedHandler);
  }

  if (onDetected) {
    detectedHandler = (result) => onDetected(result);
    Quagga.onDetected(detectedHandler);
  }

  Quagga.start();
};

const stop = () => {
  if (detectedHandler) {
    Quagga.offDetected(detectedHandler);
    detectedHandler = null;
  }
  if (isInitialized) {
    Quagga.stop();
  }
};

export const barcodeScannerService = {
  start,
  stop,
};

import Quagga from 'quagga';

let isInitialized = false;
let detectedHandler = null;
let processedHandler = null;

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
        locator: {
          patchSize: 'medium',
          halfSample: true,
        },
        locate: true,
        numOfWorkers: navigator.hardwareConcurrency
          ? Math.max(1, Math.floor(navigator.hardwareConcurrency / 2))
          : 2,
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

const start = async ({ target, onDetected, onProcessed }) => {
  if (!target) {
    throw new Error('Scanner target element not available.');
  }

  if (!isInitialized) {
    await init(target);
  }

  if (detectedHandler) {
    Quagga.offDetected(detectedHandler);
    detectedHandler = null;
  }

  if (processedHandler) {
    Quagga.offProcessed(processedHandler);
    processedHandler = null;
  }

  if (onDetected) {
    detectedHandler = (result) => onDetected(result);
    Quagga.onDetected(detectedHandler);
  }

  if (onProcessed) {
    processedHandler = (result) => onProcessed(result);
    Quagga.onProcessed(processedHandler);
  }

  Quagga.start();
};

const stop = () => {
  if (detectedHandler) {
    Quagga.offDetected(detectedHandler);
    detectedHandler = null;
  }
  if (processedHandler) {
    Quagga.offProcessed(processedHandler);
    processedHandler = null;
  }
  if (isInitialized) {
    Quagga.stop();
    isInitialized = false;
  }
};

export const barcodeScannerService = {
  start,
  stop,
};

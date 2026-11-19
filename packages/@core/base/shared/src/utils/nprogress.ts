import type NProgressType from 'nprogress';

let nProgressInstance: null | typeof NProgressType = null;

/**
 * بارگذاری تنبل nprogress
 */
async function loadNprogress() {
  if (nProgressInstance) return nProgressInstance;
  const mod = await import('nprogress');
  nProgressInstance = (mod.default ?? mod) as typeof NProgressType;
  nProgressInstance.configure({ showSpinner: true, speed: 300 });
  return nProgressInstance;
}

async function startProgress() {
  const nprogress = await loadNprogress();
  nprogress?.start();
}

async function stopProgress() {
  const nprogress = await loadNprogress();
  nprogress?.done();
}

export { startProgress, stopProgress };

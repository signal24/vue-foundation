export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
export const sleepSecs = (secs: number) => sleep(secs * 1000);

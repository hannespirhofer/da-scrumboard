// This function delays the code
// use it like await delay(2000) -> which will wait for 2s and then proceed.
export function delay(time: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, time));
}

// This is a simple in-memory flag to ensure the pinger is only started once per instance.
// In a serverless environment, a new instance might start, and this will run again, which is fine.

let pingerStarted = false;

export const pingerManager = {
  isPingerStarted: () => pingerStarted,
  setPingerStarted: () => {
    pingerStarted = true;
  },
};

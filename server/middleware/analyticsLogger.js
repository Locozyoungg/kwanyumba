import Analytics from "../models/Analytics.js";

export const logAnalyticsEvent = async (eventType, userId, data = {}) => {
  try {
    await Analytics.create({ eventType, userId, ...data });
  } catch (error) {
    console.error("Analytics Logging Error:", error);
  }
};

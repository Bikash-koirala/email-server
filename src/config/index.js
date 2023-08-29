const config = {
  env: import.meta.env.MODE,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URI,
  microsoftRedirectUri: import.meta.env.VITE_MICROSOFT_URI,
  callBackUri: import.meta.env.VITE_CALLBACK_URI,
  emailSubscribe: import.meta.env.VITE_EMAIL_SUBSCRIPTION
};

export default config;
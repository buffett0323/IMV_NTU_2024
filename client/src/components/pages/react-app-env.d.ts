/// <reference types="react-scripts" />

declare namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_CLIENT_ID: string;
      REACT_APP_CLIENT_SECRET: string;
      REACT_APP_STATE: string;
      REACT_APP_NONCE: string;
      REACT_APP_REDIRECT_URI: string;
      REACT_APP_SCOPE: string;
    }
  }
  
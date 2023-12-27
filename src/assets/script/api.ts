'use strict';

import Axios from '@/plugins/axios';

// Process ENV Details
// console.log(import.meta.env);

const api = {
  main: Axios({ baseURL: import.meta.env.VITE_APP_API_BASE_URL })
};

// console.log(api);

export default api;
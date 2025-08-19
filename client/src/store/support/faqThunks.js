import { createAsyncThunk } from "@reduxjs/toolkit";

import { SupportService } from "@/services/supportService";

const fetchFaqs = createAsyncThunk("faq/fetchFaqs", async () => {
  const response = await SupportService.getFaqs();

  return response.data;
});

export { fetchFaqs };

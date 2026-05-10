export const unwrap = <T>(res: { data: any }): T => {
  return res.data?.data ?? res.data;
};

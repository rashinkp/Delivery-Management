export interface User {
  id: string;
  role: "admin" | "driver";
  email?: string;
  mobile?: string;
  name?: string;
}

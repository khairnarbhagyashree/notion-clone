import { Users } from "./types";

declare global {
  interface CustomJwtSessionClaims extends Users {}
}

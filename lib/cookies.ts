"use server";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";
import { cookies } from "next/headers";
class CookieStore {
  private cookieStore: Promise<ReadonlyRequestCookies> = cookies();

  async get(name: string) {
    return (await this.cookieStore).get(name)?.value;
  }

  async set(name: string, value: string, duration: number = 60 * 60 * 24 * 5) {
    (await this.cookieStore).set({
      name,
      value,
      maxAge: duration,
    });
  }

  async delete(name: string) {
    (await this.cookieStore).delete(name);
  }
}

export default CookieStore;

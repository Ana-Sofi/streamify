import type { Id, Profile } from "../model/streamify.model";

class StreamifyClient {
  private baseHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };
  private authHeaders: Record<string, string> = {
    ...this.baseHeaders,
    Authorization: "Bearer ",
  };
  private _accessToken = "";

  constructor() {
    this.loadTokenFromStorage();
  }

  private set accessToken(token: string) {
    token = token.trim();
    this.authHeaders["Authorization"] = `Bearer ${token}`;
    this._accessToken = token;
  }

  private get accessToken() {
    return this._accessToken;
  }

  // Unsafe practices never read/write access tokens to localStorag
  // using it here for safe of simplicity
  private loadTokenFromStorage() {
    this.accessToken = localStorage.getItem("streamify-token") || "";
  }

  private saveTokenToStorage(token: string) {
    localStorage.setItem("streamify-token", token);
  }

  async authenticate(credentials: { email: string; password: string }) {
    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: this.baseHeaders,
        body: JSON.stringify(credentials),
      });

      const { accessToken } = (await response.json()) as {
        accessToken: string;
      };
      this.accessToken = accessToken;
      this.saveTokenToStorage(accessToken);
    } catch (err) {}
  }

  async register(profile: Profile) {
    try {
      await fetch("/api/auth/register", {
        method: "POST",
        headers: this.baseHeaders,
        body: JSON.stringify(profile),
      });
    } catch (err) {}
  }

  async getCurrentUser() {
    try {
      const response = await fetch("/api/auth/me", {
        method: "GET",
        headers: this.baseHeaders,
      });
      return (await response.json()) as Id<Omit<Profile, "password">>;
    } catch (err) {}
  }
}

export const streamifyClient = new StreamifyClient();

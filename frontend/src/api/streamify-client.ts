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
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: this.baseHeaders,
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Authentication failed");
    }

    const { accessToken } = (await response.json()) as {
      accessToken: string;
    };
    this.accessToken = accessToken;
    this.saveTokenToStorage(accessToken);
  }

  async register(profile: Profile) {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: this.baseHeaders,
      body: JSON.stringify(profile),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Registration failed");
    }

    return response.json();
  }

  async getCurrentUser() {
    const response = await fetch("/api/auth/me", {
      method: "GET",
      headers: this.authHeaders,
    });

    if (!response.ok) {
      throw new Error("Failed to fetch current user");
    }

    return (await response.json()) as Id<Omit<Profile, "password">>;
  }

  clearToken() {
    this.accessToken = "";
    localStorage.removeItem("streamify-token");
  }

  hasToken() {
    return this.accessToken.length > 0;
  }
}

export const streamifyClient = new StreamifyClient();

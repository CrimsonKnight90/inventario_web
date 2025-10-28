import { vi, describe, it, expect } from "vitest";
import axios from "axios";
import { AuthService } from "../services/auth";

vi.mock("axios");

describe("AuthService", () => {
  const mocked = axios as unknown as { create: vi.Mock };
  const instance = {
    post: vi.fn(),
    get: vi.fn(),
  };
  mocked.create = vi.fn(() => instance) as any;

  it("login should return token and user", async () => {
    const service = new AuthService("http://api.test");
    const fakeResp = {
      data: {
        access_token: "tok",
        token_type: "bearer",
        expires_in: 3600,
        refresh_token: "ref",
        user: { id: "1", email: "a@b.com", roles: ["admin"] },
      },
    };
    instance.post.mockResolvedValueOnce(fakeResp);
    const res = await service.login({ email: "a@b.com", password: "password123" });
    expect(res.token.access_token).toBe("tok");
    expect(res.user.email).toBe("a@b.com");
  });

  it("me should return user", async () => {
    const service = new AuthService("http://api.test");
    const fakeUser = { id: "1", email: "a@b.com", roles: ["user"] };
    instance.get.mockResolvedValueOnce({ data: fakeUser });
    const user = await service.me("tok");
    expect(user.email).toBe("a@b.com");
  });
});

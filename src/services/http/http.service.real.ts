// src\services\http\http.service.real.ts
import { HttpService } from './http.service';

export class HttpServiceReal implements HttpService {
  private async request<T>(
    method: string,
    url: string,
    body?: unknown,
    headers: Record<string, string> = {}
  ): Promise<T> {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    };

    // Directly use fetch to perform the HTTP request
    const response = await fetch(url, options);

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    return response.json() as Promise<T>;
  }

  async get<T>(url: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>('GET', url, undefined, headers);
  }

  async post<T>(url: string, body: unknown, headers?: Record<string, string>): Promise<T> {
    return this.request<T>('POST', url, body, headers);
  }

  async put<T>(url: string, body: unknown, headers?: Record<string, string>): Promise<T> {
    return this.request<T>('PUT', url, body, headers);
  }

  async delete<T>(url: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>('DELETE', url, undefined, headers);
  }
}

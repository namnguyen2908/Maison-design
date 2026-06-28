import useSWR from "swr";
import useSWRMutation from "swr/mutation";

export type SafeUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  provider: string;
};

async function fetcher(url: string) {
  const res = await fetch(url);
  if (res.status === 401) {
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const error = new Error(body.message ?? "An error occurred");
    (error as any).status = res.status;
    throw error;
  }
  return res.json();
}

export function useAxios<T = any>(url: string | null) {
  return useSWR<T>(url, fetcher);
}

export function useAxiosMutation<T = any>() {
  return useSWRMutation<T, any, "mutation", {
    url: string;
    method?: "POST" | "PUT" | "PATCH" | "DELETE";
    body?: any;
  }>(
    "mutation",
    async (key, { arg }) => {
      const res = await fetch(arg.url, {
        method: arg.method ?? "POST",
        headers: { "Content-Type": "application/json" },
        body: arg.body ? JSON.stringify(arg.body) : undefined,
      });
      if (res.status === 401) {
        window.location.href = "/login";
        throw new Error("Unauthorized");
      }
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const error = new Error(body.message ?? "An error occurred");
        (error as any).status = res.status;
        throw error;
      }
      return res.json();
    },
  );
}

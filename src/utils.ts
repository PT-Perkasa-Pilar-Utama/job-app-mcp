import env from "../env";

export async function fetchFromJobApp(path: string, options: RequestInit = {}) {
  const response = await fetch(`${env.JOB_APP_API_URL}${path}`, options);

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(
      `JobApp API Error (${response.status}) at ${path}: ${errorBody}`
    );
    throw new Error(
      `JobApp API request failed: ${response.status} ${response.statusText} - ${errorBody}`
    );
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

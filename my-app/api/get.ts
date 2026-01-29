interface getUserServers {}
interface gerServerMesseges {}

export type SchemaMap = {
  getUserServers: getUserServers,
  getServerMesseges: gerServerMesseges
};

export const pathObj = {
  getUserServers: "http://192.168.101.10:3027/get/getuserservers",
  getServerMesseges: "http://192.168.101.10:3027/get/getservermesseges"
};

export async function getRequest<T extends keyof SchemaMap>(
  path: T,
  method: "GET",
  link: string,
  type: T,
  token: string,
) {
  try {
    const url = `${pathObj[path]}?link=${encodeURIComponent(link)}`;

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        "authentication": `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error(`Server error: ${response.status}`);

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Request error:", err);
  }
}

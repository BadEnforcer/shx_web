/**
 * Fetches the backend JWKS (public keys for verifying access tokens).
 */

const getBaseUrl = () => {
  const url = process.env.BACKEND_URL
  if (!url) throw new Error("BACKEND_URL is not set")
  return url.replace(/\/$/, "")
}

export interface JwksKeyDto {
  kid: string
  kty: string
  alg: string
  use: string
  n: string
  e: string
}

export interface JwksResponseDto {
  keys: JwksKeyDto[]
}

export async function getJwks(): Promise<JwksResponseDto> {
  try {
    const baseUrl = getBaseUrl()
    const url = `${baseUrl}/api/auth/jwks`
    console.log("[getJwks] step: start")
    console.log("[getJwks] step: fetching", { url })
    const res = await fetch(url)
    console.log("[getJwks] step: response", {
      status: res.status,
      statusText: res.statusText,
    })
    const data = (await res.json().catch(() => ({}))) as JwksResponseDto
    console.log("[getJwks] step: response body", {
      keysCount: Array.isArray(data?.keys) ? data.keys.length : 0,
      kids: Array.isArray(data?.keys) ? data.keys.map((k) => k.kid) : [],
    })
    if (!res.ok) throw new Error("Failed to fetch JWKS")
    console.log("[getJwks] step: success")
    return data
  } catch (err) {
    console.log("[getJwks] step: error", err)
    throw err
  }
}

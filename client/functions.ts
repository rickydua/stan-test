// reset function to reset on disconnect
export async function reset(
  container: Element | null,
  button: HTMLElement | null,
  logo: Element | null,
) {
  if (container && container instanceof HTMLElement && button) {
    container.style.justifyContent = "center";
    container.style.alignItems = "center";
    container.style.height = "100vh";
    container.style.marginBottom = "";

    button.style.display = "none";

    if (logo && logo instanceof HTMLElement) {
      logo.style.width = "20%";
    }
  }
}

export async function createSha1FromBlob(blob: Blob, hashState: boolean) {
  if (!hashState) return "";
  const result = await crypto.subtle.digest("SHA-1", await blob.arrayBuffer());
  const base64String = btoa(String.fromCharCode(...new Uint8Array(result)));
  return base64String;
}

export function changeHeader(
  container: Element | null,
  button: HTMLElement | null,
  logo: Element | null,
) {
  if (container && container instanceof HTMLElement && button) {
    container.style.justifyContent = "flex-start";
    container.style.alignItems = "center";
    container.style.height = "auto";
    container.style.marginBottom = "1.5em";

    if (logo && logo instanceof HTMLElement) {
      logo.style.width = "6%";
    }
  }
}

// reset function to reset on disconnect
export async function reset(
  container: Element | null,
  button: HTMLElement | null,
  logo: Element | null
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

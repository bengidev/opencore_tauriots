function isMacPlatform(): boolean {
  return (
    typeof navigator !== "undefined" &&
    /Mac/i.test(navigator.platform || navigator.userAgent)
  );
}

export function isMacOverlayTitleBar(): boolean {
  return isMacPlatform();
}

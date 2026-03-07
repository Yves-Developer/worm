declare module "qrcode-terminal" {
  interface GenerateOptions {
    small?: boolean;
  }
  function generate(text: string, options?: GenerateOptions): void;
}

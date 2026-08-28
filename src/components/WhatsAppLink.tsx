import type { ComponentPropsWithoutRef } from "react";

const WHATSAPP_NUMBER = "5492302393510";

export function buildWhatsAppHref(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

type WhatsAppLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  message: string;
};

export function WhatsAppLink({
  message,
  target = "_blank",
  rel = "noopener noreferrer",
  ...props
}: WhatsAppLinkProps) {
  const href = buildWhatsAppHref(message);

  return <a {...props} href={href} target={target} rel={rel} />;
}

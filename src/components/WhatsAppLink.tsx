import type { ComponentPropsWithoutRef } from "react";

const WHATSAPP_NUMBER = "5492302393510";

type WhatsAppLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  message: string;
};

export function WhatsAppLink({
  message,
  target = "_blank",
  rel = "noopener noreferrer",
  ...props
}: WhatsAppLinkProps) {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  return <a {...props} href={href} target={target} rel={rel} />;
}

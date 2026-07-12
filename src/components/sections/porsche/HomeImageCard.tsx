import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface HomeImageCardProps {
  href: string;
  image: string;
  imageAlt: string;
  title: string;
  subtitle?: string;
  description?: string;
  cta?: string;
  badges?: readonly string[];
  variant?: "promo" | "model" | "highlight";
  className?: string;
}

export function HomeImageCard({
  href,
  image,
  imageAlt,
  title,
  subtitle,
  description,
  cta,
  badges,
  variant = "promo",
  className = "",
}: HomeImageCardProps) {
  return (
    <Link
      href={href}
      className={`porsche-card porsche-card--${variant} ${className}`.trim()}
    >
      <div className="porsche-card__media">
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="porsche-card__image"
          sizes={
            variant === "model"
              ? "(max-width: 768px) 100vw, 50vw"
              : "(max-width: 768px) 100vw, 33vw"
          }
        />
        <div className="porsche-card__gradient" aria-hidden />
      </div>

      <div className="porsche-card__content">
        <div className="porsche-card__text">
          {badges && badges.length > 0 && (
            <div className="porsche-card__badges">
              {badges.map((badge) => (
                <span key={badge} className="porsche-card__badge">
                  {badge}
                </span>
              ))}
            </div>
          )}
          {subtitle && variant === "promo" && (
            <p className="porsche-card__subtitle">{subtitle}</p>
          )}
          <h3 className="porsche-card__title">{title}</h3>
          {description && variant !== "promo" && (
            <p className="porsche-card__description">{description}</p>
          )}
          {cta && variant !== "promo" && (
            <span className="porsche-card__cta">{cta}</span>
          )}
        </div>
        <span className="porsche-card__arrow" aria-hidden>
          <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
        </span>
      </div>
    </Link>
  );
}

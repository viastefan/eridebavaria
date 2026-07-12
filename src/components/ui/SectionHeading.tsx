interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  label,
  title,
  description,
  align = "left",
  className = "",
}: SectionHeadingProps) {
  return (
    <div className={`${align === "center" ? "mx-auto max-w-2xl text-center" : ""} ${className}`}>
      {label && <p className="eyebrow mb-3">{label}</p>}
      <h2 className="heading-xl text-foreground">{title}</h2>
      {description && <p className="body-muted mt-4 max-w-xl">{description}</p>}
    </div>
  );
}

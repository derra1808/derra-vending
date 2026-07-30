interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  label,
  title,
  description,
  align = "center",
}: SectionHeadingProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "";

  return (
    <div className={`max-w-2xl ${alignClass}`}>
      {label && <p className="formation-label">{label}</p>}
      <h2 className="formation-title mt-4 text-3xl md:text-[2.75rem] md:leading-tight">
        {title}
      </h2>
      {description && (
        <p className="formation-body mt-5 text-base">{description}</p>
      )}
      {align === "center" && <div className="formation-line mx-auto mt-8 w-16" />}
    </div>
  );
}

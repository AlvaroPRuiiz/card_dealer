type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  text?: string;
  align?: "left" | "center";
};

export function SectionHeading({ eyebrow, title, text, align = "left" }: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div className={centered ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="mb-4 text-xs font-black uppercase tracking-[0.26em] text-casino-gold">
        {eyebrow}
      </p>
      <h2 className="text-4xl font-black leading-[0.96] tracking-tight text-casino-ivory md:text-6xl">
        {title}
      </h2>
      {text ? (
        <p
          className={`mt-6 text-base leading-8 text-casino-muted md:text-lg ${
            centered ? "mx-auto" : ""
          } max-w-2xl`}
        >
          {text}
        </p>
      ) : null}
    </div>
  );
}

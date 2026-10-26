/** Renders powers written as "10^20" with a real superscript instead of Unicode glyphs. */
const Rich = ({ children }: { children: string }) => (
  <>
    {children.split(/(\d+\^\d+)/).map((part, i) => {
      if (i % 2 === 0) return part;
      const [base, exp] = part.split("^");
      return (
        <span key={i}>
          {base}
          <sup>{exp}</sup>
        </span>
      );
    })}
  </>
);

export default Rich;

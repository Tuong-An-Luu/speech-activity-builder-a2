type PhonemeHintProps = {
  symbol: string;
  letters: string;
  example: string;
};

export default function PhonemeHint({
  symbol,
  letters,
  example,
}: PhonemeHintProps) {
  const hint = `${letters}, as in ${example}`;

  return (
    <button
      type="button"
      title={hint}
      aria-label={`${symbol}: ${hint}`}
    >
      <span>{symbol}</span>
      <span>{letters}</span>
    </button>
  );
}
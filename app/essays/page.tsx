import Link from "next/link";

export default function Page() {
  return (
    <main className="page">
      <p>Here’s a list of my writing.</p>

      <ul>
        <li>
          <Link href="/game">I Built a Word Game</Link>
        </li>
        <li>
          <Link href="/essays/ai-usage">AI Usage</Link>
        </li>
        <li>
          <Link href="/essays/writing-is-thinking">Writing Is Thinking</Link>
        </li>
        <li>
          <Link href="/essays/writing-to-communicate">
            Writing to Communicate
          </Link>
        </li>
      </ul>
    </main>
  );
}
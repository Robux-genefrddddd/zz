import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ReactNode } from "react";

interface MessageRendererProps {
  content: string;
  role: "user" | "assistant";
  isStreaming?: boolean;
}

export function MessageRenderer({
  content,
  role,
  isStreaming = false,
}: MessageRendererProps) {
  // Check if content is an image URL
  const imageUrlPattern = /^https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp|svg)$/i;
  const isImageUrl = imageUrlPattern.test(content.trim());

  if (isImageUrl) {
    return (
      <div className="flex justify-center">
        <div className="rounded-3xl overflow-hidden border-2 border-white/20 shadow-lg max-w-xs">
          <img
            src={content}
            alt="Message content"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="text-white/90 space-y-2">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ inline, className, children, ...props }: any) {
            if (inline) {
              return (
                <code className="bg-white/10 px-2 py-1 rounded font-mono text-sm text-white/90">
                  {children}
                </code>
              );
            }

            const match = /language-(\w+)/.exec(className || "");
            const lang = match ? match[1] : "";

            return (
              <div className="my-3 rounded-lg overflow-hidden bg-white/5 border border-white/10">
                {lang && (
                  <div className="bg-white/5 px-4 py-2 text-xs font-mono text-white/60 border-b border-white/10">
                    {lang}
                  </div>
                )}
                <pre className="p-4 overflow-x-auto text-white/90">
                  <code className="font-mono text-sm leading-relaxed">
                    {String(children).replace(/\n$/, "")}
                  </code>
                </pre>
              </div>
            );
          },
          p({ children }) {
            return <p className="mb-2 leading-relaxed">{children}</p>;
          },
          ul({ children }) {
            return (
              <ul className="list-disc list-inside mb-2 space-y-1">
                {children}
              </ul>
            );
          },
          ol({ children }) {
            return (
              <ol className="list-decimal list-inside mb-2 space-y-1">
                {children}
              </ol>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote className="border-l-4 border-white/30 pl-4 py-2 my-2 text-white/70 italic bg-white/5 rounded">
                {children}
              </blockquote>
            );
          },
          h1({ children }) {
            return (
              <h1 className="text-2xl font-bold mb-2 text-white mt-3">
                {children}
              </h1>
            );
          },
          h2({ children }) {
            return (
              <h2 className="text-xl font-bold mb-2 text-white mt-2">
                {children}
              </h2>
            );
          },
          h3({ children }) {
            return (
              <h3 className="text-lg font-bold mb-2 text-white">
                {children}
              </h3>
            );
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                {children}
              </a>
            );
          },
          table({ children }) {
            return (
              <div className="overflow-x-auto my-2">
                <table className="border-collapse border border-white/20">
                  {children}
                </table>
              </div>
            );
          },
          thead({ children }) {
            return <thead>{children}</thead>;
          },
          tbody({ children }) {
            return <tbody>{children}</tbody>;
          },
          tr({ children }) {
            return <tr>{children}</tr>;
          },
          th({ children }) {
            return (
              <th className="border border-white/20 px-3 py-2 bg-white/10 font-bold text-white text-sm">
                {children}
              </th>
            );
          },
          td({ children }) {
            return (
              <td className="border border-white/20 px-3 py-2 text-sm">
                {children}
              </td>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
      {isStreaming && (
        <span className="inline-block w-2 h-5 bg-white/50 ml-1 animate-pulse" />
      )}
    </div>
  );
}

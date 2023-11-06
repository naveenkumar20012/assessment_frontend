import ReactMarkdown from "react-markdown";

import remarkGfm from "remark-gfm";

import { MarkdownProps } from "./Markdown.types";

const Markdown: React.FC<MarkdownProps> = (props) => {
  const { data } = props;
  return (
    <span className="markdown-body">
      <ReactMarkdown children={data} remarkPlugins={[remarkGfm]} />
    </span>
  );
};

export default Markdown;

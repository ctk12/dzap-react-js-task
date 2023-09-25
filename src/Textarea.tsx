import React, { useMemo, useRef } from "react";
import styled, { css } from "styled-components";

type TextareaProps = {
  value: string;
  numOfLines: number;
  onValueChange: (value: string) => void;
  placeholder?: string;
  name?: string;
};

const StyledTextareaWrapper = styled.div`
  width: 100%;
  height: 350px;
  padding: 18px;
  display: flex;
`;

const sharedStyle = css`
  margin: 0;
  padding: 10px 0;
  height: 200px;
  border-radius: 0;
  resize: none;
  outline: none;
  font-family: monospace;
  font-size: 16px;
  line-height: 1.2;
  &:focus-visible {
    outline: none;
  }
`;

const StyledTextarea = styled.textarea`
  ${sharedStyle}
  margin-left: 0.5rem;
  background-color: inherit;
  width: 98%;
  height: 100%;
  border: none;
  color: var(--white-1);
  font-weight: 600;
`;

const StyledNumbers = styled.div`
  ${sharedStyle}
  display: flex;
  flex-direction: column;
  overflow: hidden;
  text-align: right;
  box-shadow: none;
  color: grey;
  border-right: 2px solid var(--white-2);
  /* background-color: t; */
  padding: 10px 10px 10px 0;
  width: max-content;
  height: 314px;
`;

export const Textarea = ({
  value,
  numOfLines,
  onValueChange,
  placeholder = "",
  name
}: TextareaProps) => {
  const lineCount = useMemo(() => value.split("\n").length, [value]);
  const linesArr = useMemo(
    () =>
      Array.from({ length: Math.max(numOfLines, lineCount) }, (_, i) => i + 1),
    [lineCount, numOfLines]
  );

  const lineCounterRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextareaChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    onValueChange(event.target.value);
  };

  const handleTextareaScroll = () => {
    if (lineCounterRef.current && textareaRef.current) {
      lineCounterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  };

  return (
    <StyledTextareaWrapper>
      <StyledNumbers ref={lineCounterRef}>
        {linesArr.map((count) => (
          <div key={count}>
            {count}
          </div>
        ))}
      </StyledNumbers>
      <StyledTextarea
        name={name}
        onChange={handleTextareaChange}
        onScroll={handleTextareaScroll}
        placeholder={placeholder}
        ref={textareaRef}
        value={value}
        wrap="off"
      />
    </StyledTextareaWrapper>
  );
};

import React, { useState } from "react";

interface ReadMoreProps {
  id: string;
  text: string;
  amountOfWords?: number;
}

const ReadMore: React.FC<ReadMoreProps> = ({
  id,
  text,
  amountOfWords = 50,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const spiltText = text.split(" ");
  const itCanOverflow = spiltText.length > amountOfWords;
  const beginText = itCanOverflow
    ? spiltText.slice(0, amountOfWords - 1).join(" ")
    : text;
  const endText = spiltText.slice(amountOfWords - 1).join(" ");
  return (
    <p
      id={id}
      className="mt-1 pl-6 font-helvetica text-gray-500 max-sm:text-sm"
    >
      {beginText}
      {itCanOverflow && (
        <>
          {!isExpanded && <span className="ml-1">...</span>}
          <span className={`${!isExpanded && "hidden"}`}>&nbsp;{endText}</span>
          <span
            className="ml-2 text-clay-red hover:cursor-pointer"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? "show less" : "show more"}
          </span>
        </>
      )}
    </p>
  );
};

export default ReadMore;

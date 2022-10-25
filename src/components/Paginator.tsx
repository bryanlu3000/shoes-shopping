import { Button, Flex, HStack, IconButton, Tag } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { useEffect, useState } from "react";

interface PaginatorProps {
  totalPages: number;
  slicePages: number; // the maximum pagination to show per line
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  //the flag to identify if the page change in the url caused by browser history backward/forward or the paginator button clicking.
  setIsUrlPageChange: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Paginator({
  totalPages,
  slicePages,
  currentPage,
  setCurrentPage,
  setIsUrlPageChange,
}: PaginatorProps) {
  const items = [];
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(
    totalPages > slicePages ? slicePages : totalPages
  );

  // If another new data fetch has the same totalPages, no need to reset the whole paginator. The external app just needs to reset the currentPage to 1;
  useEffect(() => {
    setStartPage(1);
    // setCurrentPage(1);
    setEndPage(totalPages > slicePages ? slicePages : totalPages);
  }, [totalPages]);

  useEffect(() => {
    if (currentPage < 1 || currentPage > totalPages) {
      totalPages = 0;
    } else {
      if (currentPage < startPage || currentPage > endPage) {
        setStartPage(
          currentPage -
            (currentPage % slicePages === 0
              ? slicePages
              : currentPage % slicePages) +
            1
        );

        if (
          totalPages - currentPage >
          slicePages -
            (currentPage % slicePages === 0
              ? slicePages
              : currentPage % slicePages)
        ) {
          setEndPage(
            currentPage +
              slicePages -
              (currentPage % slicePages === 0
                ? slicePages
                : currentPage % slicePages)
          );
        } else {
          setEndPage(totalPages);
        }
      }
    }
  }, [currentPage]);

  const onLeftClick = () => {
    if (currentPage > 1) {
      setIsUrlPageChange(false);
      setCurrentPage((prev) => prev - 1);
    }
  };

  const onRightClick = () => {
    if (currentPage < totalPages) {
      setIsUrlPageChange(false);
      setCurrentPage((prev) => prev + 1);
    }
  };

  for (let i = startPage; i <= endPage; i++) {
    items.push(
      <Button
        key={i}
        bgColor={i === currentPage ? "blue.200" : ""}
        onClick={() => {
          setIsUrlPageChange(false);
          setCurrentPage(i);
        }}
      >
        {i}
      </Button>
    );
  }

  return (
    <>
      {totalPages > 1 && (
        <Flex
          direction={["column", "column", "row"]}
          gap={[2, 2, 10, 20]}
          align="center"
        >
          <HStack spacing={[1, 2, 2, 4]}>
            {currentPage !== 1 && (
              <IconButton
                aria-label="Go to previous page"
                icon={<ChevronLeftIcon />}
                onClick={onLeftClick}
              />
            )}
            {items}
            {currentPage !== totalPages && (
              <IconButton
                aria-label="Go to next page"
                icon={<ChevronRightIcon />}
                onClick={onRightClick}
              />
            )}
          </HStack>
          <Tag
            size="lg"
            colorScheme="blue"
            borderRadius="full"
            variant="solid"
            justifyContent="center"
          >
            {currentPage} of {totalPages} PAGES
          </Tag>
        </Flex>
      )}
    </>
  );
}

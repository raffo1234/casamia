"use client";

import { useState } from "react";
import useSWR from "swr";
import InfiniteScrollSentinel from "./InfiniteScrollSentinel";
import { PropertyType } from "@/types/propertyType";
import PageComponent from "./PageComponent";

export default function PropertiesList({
  userEmail,
  swrKeyTotal,
  swrKeyPage,
  fetcherPage,
  fetcherTotal,
}: {
  userEmail: string | undefined | null;
  swrKeyTotal: string;
  swrKeyPage: string;
  fetcherPage: (
    index: number,
    pageSize: number
  ) => Promise<PropertyType[] | null>;
  fetcherTotal: () => Promise<number>;
}) {
  const initPage = 1;
  const pageSize = 4;
  const [page, setPage] = useState(initPage);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { data: total } = useSWR(swrKeyTotal, fetcherTotal);
  const totalPages = total ? Math.ceil((total - pageSize) / pageSize) : 0;
  const pages = [];

  for (let i = initPage; i < page; i++) {
    pages.push(
      <PageComponent
        key={i}
        page={i}
        pageSize={pageSize}
        setIsLoadingMore={setIsLoadingMore}
        userEmail={userEmail}
        swrKeyPage={swrKeyPage}
        fetcherPage={fetcherPage}
      />
    );
  }

  return (
    <>
      {pages.map((page) => page)}
      {!isLoadingMore && page <= totalPages ? (
        <InfiniteScrollSentinel
          onElementVisible={() => setPage((prev) => prev + 1)}
          loading={isLoadingMore}
        />
      ) : null}
    </>
  );
}

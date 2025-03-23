"use client";

import { useState, useEffect } from "react";
import { Rocket, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

export default function ImageSearch() {
  const [query, setQuery] = useState("");
  const [imageType, setImageType] = useState("all");
  const [images, setImages] = useState([]);
  const [totalimg, settotalimg] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const searchImages = async (reset) => {
    if (query.trim() === "") return;

    setLoading(true);
    reset && setImages([]);
    const currentPage = reset ? 1 : page;
    try {
      const response = await fetch(
        `https://pixabay.com/api/?key=${
          process.env.NEXT_PUBLIC_PIXABAY_API_KEY
        }&q=${encodeURIComponent(
          query
        )}&image_type=${imageType}&page=${currentPage} `
      );
      const data = await response.json();
      console.log(data);
      if (data.hits === 0) {
        setHasMore(false);
        settotalimg(0);
      } else {
        setImages(reset ? data.hits : [...images, ...data.hits]);
        setPage(currentPage + 1);
        settotalimg(data.total);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(1);
    setHasMore(true);
    searchImages(true);
  };

  const handleLoadMore = () => {
    searchImages();
  };

  const handleTypeChange = (value) => {
    setImageType(value);
    if (query) {
      setPage(1);
      setHasMore(true);
    }
  };

  const splitIntoColumns = (array, columns) => {
    const result = Array.from({ length: columns }, () => []);
    array.forEach((item, index) => {
      const columnIndex = index % columns;
      result[columnIndex].push(item);
    });
    return result;
  };

  return (
    <section className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for images..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-10"
          />
        </div>
        <Select value={imageType} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Image type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="photo">Photo</SelectItem>
            <SelectItem value="illustration">Illustration</SelectItem>
            <SelectItem value="vector">Vector</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleSearch} className={"cursor-pointer"}>
          <Search />
          Search
        </Button>
      </div>

      {images.length > 0 ? (
        <>
          <p className="w-full border-b pb-2 font-bold">Total: {totalimg}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {splitIntoColumns(
              images.filter((imageRaw) => {
                if (imageType === "all") return true;
                return imageRaw.type.includes(imageType);
              }),
              4
            ).map((column, columnIndex) => (
              <div key={columnIndex} className="flex flex-col gap-3">
                {column.map((image, index) => (
                  <div
                    key={index}
                    className="flex flex-col justify-start h-fit items-center group cursor-pointer relative"
                    onClick={() =>
                      window.open(
                        image.fullHDURL || image.largeImageURL,
                        "_blank"
                      )
                    }
                  >
                    <div
                      className=" group-hover:scale-95 transition-transform duration-300"
                      style={{
                        aspectRatio: `${image.webformatWidth} / ${image.webformatHeight}`,
                      }}
                    >
                      <p className="absolute z-10 p-2 bg-white/50 rounded-xl text-xs bottom-2 right-0">
                        {image.type}
                      </p>
                      <Image
                        src={image.webformatURL}
                        alt={image.tags.split(",").slice(0, 3).toString()}
                        width={image.webformatWidth}
                        height={image.webformatHeight}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
          {hasMore && images.length !== totalimg && (
            <div className="flex justify-center mt-6 border-t pt-4 ">
              <Button
                onClick={handleLoadMore}
                disabled={loading}
                className={"cursor-pointer w-48"}
              >
                <Rocket /> {loading ? "Loading..." : "Load More"}
              </Button>
            </div>
          )}
        </>
      ) : query ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            No images found. Try a different search term.
          </p>
        </div>
      ) : null}
    </section>
  );
}

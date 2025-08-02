"use client";

import { PropertyType } from "@/types/propertyState";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
type Inputs = {
  type: string;
  keywords: string;
};

export default function SearchForm() {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [typeInput, setTypeInput] = useState<string>(PropertyType.APARTMENT);
  const { register, handleSubmit } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (formData) => {
    const propertyType = typeInput.toLowerCase();
    const trimmedSearchWord = formData.keywords.trim();
    let path: string;

    if (trimmedSearchWord) {
      const encodedSearchWord = encodeURIComponent(trimmedSearchWord);
      path = `/${propertyType}/${encodedSearchWord}`;
    } else {
      path = `/${propertyType}`;
    }
    router.push(path);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mb-20 w-full max-w-[600px] mx-auto relative z-10"
    >
      <div className="w-full hover:bg-white hover:border-cyan-100 focus-within:bg-white focus-within:border-cyan-100 border-2 transition-colors duration-500 border-gray-100 flex items-center bg-gray-100 rounded-full p-1 gap-2">
        <div
          onMouseEnter={() => setIsOpen(true)}
          onMouseLeave={() => setIsOpen(false)}
          className="relative group"
        >
          <button
            type="button"
            className="h-[52px] pl-6 pr-3 bg-slate-200 font-semibold rounded-full flex items-center gap-1"
          >
            <span>
              {typeInput === PropertyType.APARTMENT ? "Depas" : "Casas"}
            </span>
            <div className="w-6">
              <svg
                className={`${
                  isOpen ? "rotate-90" : "-rotate-90"
                } transition-transform duration-200`}
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="m10.108 12l4.246 4.246q.14.14.15.345q.01.203-.15.363t-.354.16t-.354-.16l-4.388-4.389q-.131-.13-.184-.267q-.053-.136-.053-.298t.053-.298t.184-.267l4.388-4.389q.14-.14.344-.15t.364.15t.16.354t-.16.354z"
                />
              </svg>
            </div>
          </button>
          <div
            className={`${
              isOpen
                ? "translate-y-0 visible opacity-100"
                : "-translate-y-1 invisible opacity-0"
            } absolute transition-all duration-500 top-full left-0 w-[120px] py-3`}
          >
            <div className="bg-white shadow-md rounded-[30px] p-2 flex flex-col">
              <button
                type="button"
                onClick={() => {
                  setTypeInput(PropertyType.APARTMENT);
                  setIsOpen(false);
                }}
                className="w-full text-left px-5 py-3 hover:bg-slate-100 rounded-full"
              >
                Depas
              </button>
              <button
                onClick={() => {
                  setTypeInput(PropertyType.HOUSE);
                  setIsOpen(false);
                }}
                type="button"
                className="w-full text-left px-5 py-3 hover:bg-slate-100 rounded-full"
              >
                Casas
              </button>
            </div>
          </div>
        </div>
        <div className="flex-grow w-[100px]">
          <input
            type="search"
            {...register("keywords")}
            className="w-full flex-grow placeholder:text-gray-400 border-transparent border-2 focus:outline-none py-3 bg-transparent"
            placeholder="Buscar ..."
          />
        </div>
        <button
          type="submit"
          className="h-[52px] aspect-square rounded-full bg-cyan-400 hover:bg-cyan-500 active:bg-cyan-600 transition duration-700 flex items-center justify-center"
        >
          <svg
            className="text-white text-2xl"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <g fill="none" fillRule="evenodd">
              <path d="m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z" />
              <path
                fill="currentColor"
                d="M10.5 2a8.5 8.5 0 1 0 5.262 15.176l3.652 3.652a1 1 0 0 0 1.414-1.414l-3.652-3.652A8.5 8.5 0 0 0 10.5 2M4 10.5a6.5 6.5 0 1 1 13 0a6.5 6.5 0 0 1-13 0"
              />
            </g>
          </svg>
        </button>
      </div>
    </form>
  );
}

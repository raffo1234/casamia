// import { formatFileSize } from "@/utils/formatFileSize";
import { CustomFile, CustomFileState } from "./AttachFiles";
// import { useUploadTimer } from "@/hooks/useUploadTimer";
// import deleteEntity from "@/lib/deleteEntity";
// import { useState } from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { formatFileSize } from "@/utils/formatFileSize";

export default function FileUploadItem({
  file,

  removeCustomFile,
}: {
  file: CustomFile;

  removeCustomFile: () => void;
}) {
  return (
    <div className="py-3 px-4 border-lg border border-gray-200 rounded-lg bg-white relative">
      <div className="flex gap-4 items-start">
        {file.file.type.startsWith("image/") ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
          >
            <g fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M2 12c0-4.714 0-7.071 1.464-8.536C4.93 2 7.286 2 12 2s7.071 0 8.535 1.464C22 4.93 22 7.286 22 12s0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12Z" />
              <circle cx="16" cy="8" r="2" />
              <path
                strokeLinecap="round"
                d="m5 13.307l.81-.753a2.3 2.3 0 0 1 3.24.108l2.647 2.81c.539.572 1.42.649 2.049.18a2.32 2.32 0 0 1 2.986.181L19 18"
              />
            </g>
          </svg>
        ) : null}
        {file.file.type === "application/pdf" ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 16 16"
          >
            <path
              fill="currentColor"
              d="M13.156 9.211c-.213-.21-.686-.321-1.406-.331a12 12 0 0 0-1.69.124c-.276-.159-.561-.333-.784-.542c-.601-.561-1.103-1.34-1.415-2.197c.02-.08.038-.15.054-.222c0 0 .339-1.923.249-2.573a.7.7 0 0 0-.044-.184l-.029-.076c-.092-.212-.273-.437-.556-.425l-.171-.005c-.316 0-.573.161-.64.403c-.205.757.007 1.889.39 3.355l-.098.239c-.275.67-.619 1.345-.923 1.94l-.04.077c-.32.626-.61 1.157-.873 1.607l-.271.144c-.02.01-.485.257-.594.323c-.926.553-1.539 1.18-1.641 1.678c-.032.159-.008.362.156.456l.263.132a.8.8 0 0 0 .357.086c.659 0 1.425-.821 2.48-2.662a25 25 0 0 1 3.819-.908c.926.521 2.065.883 2.783.883q.193 0 .327-.036a.56.56 0 0 0 .325-.222c.139-.21.168-.499.13-.795a.53.53 0 0 0-.157-.271zM3.307 12.72c.12-.329.596-.979 1.3-1.556c.044-.036.153-.138.253-.233c-.736 1.174-1.229 1.642-1.553 1.788zm4.169-9.6c.212 0 .333.534.343 1.035s-.107.853-.252 1.113c-.12-.385-.179-.992-.179-1.389c0 0-.009-.759.088-.759M6.232 9.961q.222-.395.458-.839c.383-.724.624-1.29.804-1.755a5.8 5.8 0 0 0 1.328 1.649q.098.083.207.166c-1.066.211-1.987.467-2.798.779zm6.72-.06c-.065.041-.251.064-.37.064c-.386 0-.864-.176-1.533-.464q.386-.029.705-.029c.387 0 .502-.002.88.095s.383.293.318.333z"
            />
            <path
              fill="currentColor"
              d="M14.341 3.579c-.347-.473-.831-1.027-1.362-1.558S11.894 1.006 11.421.659C10.615.068 10.224 0 10 0H2.25C1.561 0 1 .561 1 1.25v13.5c0 .689.561 1.25 1.25 1.25h11.5c.689 0 1.25-.561 1.25-1.25V5c0-.224-.068-.615-.659-1.421m-2.07-.85c.48.48.856.912 1.134 1.271h-2.406V1.595c.359.278.792.654 1.271 1.134zM14 14.75c0 .136-.114.25-.25.25H2.25a.253.253 0 0 1-.25-.25V1.25c0-.135.115-.25.25-.25H10v3.5a.5.5 0 0 0 .5.5H14z"
            />
          </svg>
        ) : null}
        <div className="font-semibold text-sm pt-0.5 truncate pr-12">
          {file.file.name}
        </div>
      </div>
      <div className="flex justify-between items-start mb-2 pl-9.5">
        <div className="text-xs text-gray-400">
          {formatFileSize(file.file.size)}
          {/* {file.state === CustomFileState.uploading && timeLeft !== null
            ? ` - ${Math.ceil(timeLeft)}s left`
            : null} */}
        </div>
        {file.state !== CustomFileState.complete ? (
          <div className="text-xs text-gray-400">{file.uploadPercentage}%</div>
        ) : null}
      </div>
      {file.state !== CustomFileState.complete ? (
        <div className="relative w-full bg-gray-200 h-1 rounded-full">
          <div
            style={{ width: `${file.uploadPercentage}%` }}
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan-100 animate-pulse to-cyan-400 rounded-full transition-all duration-300"
          />
        </div>
      ) : null}
      {file.state !== CustomFileState.complete ? (
        <button
          disabled={file.state === CustomFileState.uploading}
          title="Remove"
          onClick={removeCustomFile}
          className="disabled:opacity-60 disabled:pointer-events-none absolute right-1 top-0 cursor-pointer p-2 hover:text-cyan-400 transition-colors duration-300"
        >
          {file.state === CustomFileState.uploading ? (
            <Icon
              icon="solar:record-broken"
              className="animate-spin"
              fontSize={24}
            />
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="m12 12.708l-5.246 5.246q-.14.14-.344.15t-.364-.15t-.16-.354t.16-.354L11.292 12L6.046 6.754q-.14-.14-.15-.344t.15-.364t.354-.16t.354.16L12 11.292l5.246-5.246q.14-.14.345-.15q.203-.01.363.15t.16.354t-.16.354L12.708 12l5.246 5.246q.14.14.15.345q.01.203-.15.363t-.354.16t-.354-.16z"
              />
            </svg>
          )}
        </button>
      ) : (
        <div className="p-2 absolute right-1 top-0 text-cyan-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M12 21a9 9 0 1 0 0-18a9 9 0 0 0 0 18m-.232-5.36l5-6l-1.536-1.28l-4.3 5.159l-2.225-2.226l-1.414 1.414l3 3l.774.774z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

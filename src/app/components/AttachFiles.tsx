"use client";

import { v4 as uuidv4 } from "uuid";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useDropzone } from "react-dropzone";
import { useState } from "react";
import uploadSignedFile from "@/lib/uploadSignedFile";
import { supabase } from "@/lib/supabase";
import { SupabaseClient } from "@supabase/supabase-js";
import { sanitize } from "@/lib/sanitize";
import FileUploadItem from "./FileUploadItem";
import toast from "react-hot-toast";
import editFileById from "@/lib/editFileById";
import { mutate } from "swr";

export enum CustomFileState {
  selected = "Selected",
  uploading = "Uploading",
  errorSigning = "Error Signing Url",
  complete = "Complete",
}

interface InsertOperationResult {
  id: string | null; // Null if insertion failed
  error: Error | null;
}

export type CustomFile = {
  id: string;
  file: File;
  state: CustomFileState;
  uploadPercentage: number;
  dbId?: string | null;
  publicUrl?: string | null;
};

async function insertNewFile(
  table: string,
  parentColumnKey: string,
  supabase: SupabaseClient,
  parentColumnValue: string | undefined,
  publicUrl: string | undefined
): Promise<InsertOperationResult> {
  const { data, error } = await supabase
    .from(table)
    .insert([
      {
        [parentColumnKey]: parentColumnValue,
        image_url: publicUrl,
      },
    ])
    .select("id")
    .single();

  if (error) {
    console.error("Error inserting record:", error.message);
    return { id: null, error: new Error(error.message) };
  }

  if (data) {
    return { id: data.id, error: null };
  } else {
    console.error("Insert operation returned no data despite no error.");
    return { id: null, error: new Error("Insert operation returned no data.") };
  }
}

export default function AttachFiles({
  table,
  parentColumnKey,
  parentColumnValue,
  keyPrefix,
}: {
  table: string;
  parentColumnKey: string;
  parentColumnValue: string;
  keyPrefix: string;
}) {
  const [files, setFiles] = useState<CustomFile[]>([]);
  const [isAttaching, setIsAttaching] = useState(false);

  const onDrop = (acceptedFiles: File[]) => {
    const newFiles: CustomFile[] = acceptedFiles.map((file) => ({
      id: uuidv4(),
      file,
      state: CustomFileState.selected,
      uploadPercentage: 0,
    }));
    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
    },
  });

  const attachFiles = async (files: CustomFile[]) => {
    setIsAttaching(true);

    for (let index = 0; index < files.length; index++) {
      const customFile = files[index];
      const now = Date.now().toString();

      if (customFile.state !== CustomFileState.selected) {
        console.info(
          `Skipping file at index ${index} because it is not in the selected state.`
        );
        continue;
      }

      const updateProgress = (progress: number) => {
        editFileById(setFiles, customFile.id, {
          uploadPercentage: progress,
        });
      };

      editFileById(setFiles, customFile.id, {
        state: CustomFileState.uploading,
      });

      const urlSigned = await uploadSignedFile(
        customFile.file,
        now,
        parentColumnValue,
        keyPrefix,
        updateProgress
      );

      if (!urlSigned) {
        editFileById(setFiles, customFile.id, {
          state: CustomFileState.errorSigning,
        });
        continue;
      }

      const filename = sanitize(`${now}_${customFile.file.name}`);
      const publicUrl = `${process.env.NEXT_PUBLIC_PUBLIC_DEVELOPMENT_URL}/${keyPrefix}_${parentColumnValue}/${filename}`;
      console.log("Public URL:", publicUrl);
      const { id: insertedId } = await insertNewFile(
        table,
        parentColumnKey,
        supabase,
        parentColumnValue,
        publicUrl
      );

      if (insertedId) {
        editFileById(setFiles, customFile.id, {
          state: CustomFileState.complete,
          dbId: insertedId,
          publicUrl,
        });
      }

      await mutate(parentColumnValue);
    }
    setIsAttaching(false);
    setFiles([]);
    toast.success("Imágenes subidas correctamente");
  };

  const removeCustomFile = (idToRemove: CustomFile["id"]) => {
    setFiles((prev) => prev.filter((item) => item.id !== idToRemove));
  };

  return (
    <>
      <div
        {...getRootProps()}
        className={`${
          isDragActive
            ? "bg-cyan-50 border-cyan-100"
            : "bg-gray-50 border-gray-300"
        }
            ${isAttaching ? "cursor-no-drop" : "cursor-pointer"}
            mb-5 transition-all  hover:outline-8 outline-cyan-50 duration-300 hover:border-cyan-200 bg-white flex flex-col group items-center justify-center py-20 w-full border border-dashed rounded-2xl`}
      >
        <div className="w-11 h-11 relative mb-3">
          <Icon
            icon="solar:record-broken"
            className={`${
              isAttaching ? "opacity-100" : "opacity-0"
            } text-gray-500 animate-spin absolute left-0 top-0 group-hover:text-cyan-400 transition-all duration-300`}
            fontSize={42}
          />
          <Icon
            icon="f7:arrow-up-doc-fill"
            className={`
              ${isAttaching ? "opacity-0" : "opacity-100"}
              text-gray-700 absolute left-0 top-0 group-hover:text-cyan-400 transition-all duration-300`}
            fontSize={42}
          />
        </div>
        <p className="mb-0.5 font-semibold">
          <span className="text-cyan-500">Haz clic para subir</span> o arrastra
          y suelta
        </p>
        <span className="text-sm text-gray-400">(Max. File size: 25 MB)</span>
        <input
          {...getInputProps()}
          disabled={isAttaching}
          type="file"
          className="hidden"
          multiple
        />
      </div>
      {files.length > 0 ? (
        <div className="font-semibold">
          {files.length} File{files.length !== 1 ? "s" : ""} Selected
        </div>
      ) : null}
      <div className="flex flex-col mt-3 gap-2">
        {files.map((file) => {
          return (
            <FileUploadItem
              removeCustomFile={() => removeCustomFile(file.id)}
              file={file}
              key={file.id}
            />
          );
        })}
      </div>
      {files.filter((file) => file.state === CustomFileState.selected).length >
      0 ? (
        <div className="flex justify-center mt-6">
          <button
            disabled={isAttaching}
            onClick={() => attachFiles(files)}
            type="button"
            title="Attach files"
            className="flex gap-2 self-end cursor-pointer text-white px-6 py-2 rounded-full bg-cyan-400 disabled:bg-cyan-200 disabled:cursor-not-allowed"
          >
            <span>Upload Im&aacute;genes</span>
          </button>
        </div>
      ) : null}
    </>
  );
}

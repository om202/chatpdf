"use client";
import { uploadToS3 } from "@/lib/db/s3";
import { useMutation } from "@tanstack/react-query";
import { Inbox, Loader2 } from "lucide-react";
import React from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const FileUpload = () => {
  const [uploading, setUploading] = React.useState(false);
  const { mutate, isPending } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      const response = await axios.post("/api/create-chat", {
        file_key,
        file_name,
      });
      return response.data;
    },
  });

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      console.log(acceptedFiles);
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        alert("File size is too large. Please upload a file less than 10MB");
        return;
      }
      try {
        setUploading(true);
        const data = await uploadToS3(file);
        if (!data?.file_key || !data?.file_name) {
          alert("An error occurred while uploading the file");
          return;
        }
        mutate(data, {
          onSuccess: (data) => {
            console.log(data);
            alert("File uploaded successfully " + data.message);
          },
          onError: (error) => {
            console.error(error);
          },
        });
      } catch (error) {
        console.error(error);
      }
      setUploading(false);
    },
  });
  return (
    <div className="p-2 bg-white rounded-xl">
      <div
        {...getRootProps()}
        className="border-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-col"
      >
        <input {...getInputProps()} />
        {uploading || isPending ? (
          <>
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
            <p>Loading...</p>
          </>
        ) : (
          <>
            <Inbox className="w-10 h-10 text-blue-500" />
            <p className="mt-2 text-sm text-slate-400">Drop your PDF here</p>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUpload;

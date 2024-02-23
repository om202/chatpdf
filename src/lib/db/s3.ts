import AWS from "aws-sdk";

export async function uploadToS3(file: File) {
  try {
    AWS.config.update({
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
    });

    const s3 = new AWS.S3({
      params: { Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME || "" },
      region: process.env.NEXT_PUBLIC_AWS_BUCKET_REGION,
    });

    const file_key =
      "uploads/" + Date.now().toString() + file.name.replace(" ", "-");

    const upload = s3
      .putObject({
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
        Key: file_key,
        Body: file,
      })
      .on("httpUploadProgress", (e) => {
        console.log("Uploading to S3 ", e.loaded, e.total);
      })
      .promise();

    await upload.then((data) => {
      console.log("Uploaded to S3", data);
    });

    return Promise.resolve({
      file_key,
      file_name: file.name,
    });
  } catch (error) {
    console.error(error);
  }
}

export async function getFromS3(file_key: string) {
  const url = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_BUCKET_REGION}.amazonaws.com/${file_key}`;
  return url;
}

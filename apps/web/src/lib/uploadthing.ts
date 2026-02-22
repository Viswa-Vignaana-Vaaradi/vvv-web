// import { generateReactHelpers, generateUploadButton } from "@uploadthing/react";
// import type { UploadRouter } from "@repo/uploadthing";
// import { env } from "@repo/env/web";

// const apiUrl = `${env.NEXT_PUBLIC_SERVER_URL}/api/uploadthing`;

// export const UploadButton = generateUploadButton<UploadRouter>({
//   url: apiUrl,
//   fetch: (input, init) => {
//     const url = new URL(input instanceof Request ? input.url : input.toString());
    
//     return fetch(url, {
//       ...init,
//       credentials: "include",
//       headers: {
//         ...init?.headers,
//       },
//     });
//   },
// });

// export const { useUploadThing } = generateReactHelpers<UploadRouter>({
//   url: apiUrl,
//   fetch: (input, init) => {
//     const url = new URL(input instanceof Request ? input.url : input.toString());
    
//     return fetch(url, {
//       ...init,
//       credentials: "include",
//       headers: {
//         ...init?.headers,
//       },
//     });
//   },
// });

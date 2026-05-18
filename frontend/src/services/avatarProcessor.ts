/**
 * Processes an avatar image file by cropping it to a 1:1 square,
 * resizing it to 300x300, and compressing it as a JPEG.
 * 
 * @param file The image file selected by the user
 * @returns A Promise that resolves to the compressed Base64 JPEG string
 */
export async function processAvatar(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error("No file provided"));
    }

    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return reject(new Error("Failed to get canvas context"));
        }

        // Set dimensions to 300x300 (square 1:1)
        const size = 300;
        canvas.width = size;
        canvas.height = size;

        // Square cropping logic (center crop)
        let sx = 0;
        let sy = 0;
        let sWidth = img.width;
        let sHeight = img.height;

        if (img.width > img.height) {
          sWidth = img.height;
          sx = (img.width - img.height) / 2;
        } else if (img.height > img.width) {
          sHeight = img.width;
          sy = (img.height - img.width) / 2;
        }

        // Draw image cropped in square and resized to 300x300
        ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, size, size);

        // Compress image to JPEG quality 70%
        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
        resolve(compressedBase64);
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };

      if (event.target?.result) {
        img.src = event.target.result as string;
      } else {
        reject(new Error("Failed to read file"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  });
}

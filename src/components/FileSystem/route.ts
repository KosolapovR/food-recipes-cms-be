import express, { Request, Response } from "express";
import { uuid } from "uuidv4";
import multer from "multer";

import { protectedRoute } from "../../middlewares";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = uuid();
    const parts = (file.filename || "").split(".");
    const ext = parts[parts.length - 1];
    const mimeTypesMap: { [key in string]: string } = {
      "image/jpeg": ".jpeg",
      "image/png": ".png",
    };
    cb(
      null,
      file.fieldname +
        "-" +
        uniqueSuffix +
        (ext || mimeTypesMap[file.mimetype] || "")
    );
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  callback: multer.FileFilterCallback
) => {
  const availableMimeTypes = ["image/jpeg", "image/png"];
  callback(null, availableMimeTypes.includes(file.mimetype));
};

const upload = multer({
  storage,
  fileFilter,
});

const router = express.Router();

router.use(protectedRoute);

/**
 * @route POST /upload
 * @group Upload - Operations about upload
 * @param {string} image.body
 * @returns {UploadModel.model} 201 - return imagePath
 * @returns {Error}  400 - All input is required
 * @returns {Error}  401 - Wrong credentials
 */
router.post(
  "/",
  upload.single("image"),
  async function (req: Request, res: Response) {
    try {
      const image = req.file;

      if (!image) {
        return res.status(400).send("All input is required");
      }

      return res.status(201).json({
        message: "image successfully uploaded",
        imagePath: image.path,
      });
    } catch (error) {
      return res.status(500).json({ error });
    }
  }
);

export { router as uploadRouter };

import { Router } from "express";
import * as dc from "../controllers/destination.controller";
import { protect } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";
import multer from "multer";
const upload = multer({ dest: "uploads/" });

const router = Router();

router.get("/", dc.getAll);
router.post(
  "/",
  protect,
  authorize("ADMIN"),
  upload.single("image"),
  dc.create,
);
router.put(
  "/:id",
  protect,
  authorize("ADMIN"),
  upload.single("image"),
  dc.update,
);
router.delete("/:id", protect, authorize("ADMIN"), dc.remove);

export default router;

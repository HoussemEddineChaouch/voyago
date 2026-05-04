import { Router } from "express";
import multer from "multer";
import * as vc from "../controllers/voyage.controller";
import { protect } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();
const upload = multer({ dest: "uploads/" });

router.get("/", vc.getAll);
router.get("/:slug", vc.getBySlug);
router.post(
  "/",
  protect,
  authorize("ADMIN"),
  upload.single("image"),
  vc.create,
);
router.put(
  "/:id",
  protect,
  authorize("ADMIN"),
  upload.single("image"),
  vc.update,
);
router.delete("/:id", protect, authorize("ADMIN"), vc.remove);

export default router;

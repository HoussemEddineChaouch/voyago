import { Request, Response } from "express";
import Destination from "../models/Destination";
import Voyage from "../models/Voyage";

// GET /destinations
export const getAll = async (_req: Request, res: Response) => {
  const destinations = await Destination.find().sort({ name: 1 });
  const withCount = await Promise.all(
    destinations.map(async (d) => {
      const tripCount = await Voyage.countDocuments({ destination: d._id });
      return { ...d.toObject(), tripCount };
    }),
  );
  res.json(withCount);
};

// POST /destinations  (ADMIN)
export const create = async (req: Request, res: Response) => {
  const data = { ...req.body };
  if ((req as any).file) data.image = (req as any).file.filename;
  const dest = await Destination.create(data);
  res.status(201).json(dest);
};

// PUT /destinations/:id  (ADMIN)
export const update = async (req: Request, res: Response) => {
  const data = { ...req.body };
  if ((req as any).file) data.image = (req as any).file.filename;
  const dest = await Destination.findByIdAndUpdate(req.params.id, data, {
    new: true,
  });
  res.json(dest);
};

// DELETE /destinations/:id  (ADMIN)
export const remove = async (req: Request, res: Response) => {
  await Destination.findByIdAndDelete(req.params.id);
  res.json({ message: "Destination deleted" });
};

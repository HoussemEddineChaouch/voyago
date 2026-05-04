import { Request, Response } from "express";
import Voyage from "../models/Voyage";

// GET /voyages — filters + pagination
export const getAll = async (req: Request, res: Response) => {
  const {
    destination,
    maxPrice,
    date,
    featured,
    page = 1,
    limit = 12,
  } = req.query;
  const filter: any = {};
  if (destination) filter.destination = destination;
  if (maxPrice) filter.price = { $lte: Number(maxPrice) };
  if (date) filter.date = { $gte: new Date(date as string) };
  if (featured) filter.featured = true;

  const voyages = await Voyage.find(filter)
    .populate("destination", "name slug")
    .sort({ featured: -1, createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await Voyage.countDocuments(filter);
  res.json({ voyages, total, pages: Math.ceil(total / Number(limit)) });
};

// GET /voyages/:slug
export const getBySlug = async (req: Request, res: Response) => {
  const voyage = await Voyage.findOne({ slug: req.params.slug }).populate(
    "destination",
  );
  if (!voyage) return res.status(404).json({ message: "Voyage not found" });
  res.json(voyage);
};

// POST /voyages  (ADMIN)
export const create = async (req: Request, res: Response) => {
  const data = { ...req.body };
  if ((req as any).file) data.image = (req as any).file.filename;
  const voyage = await Voyage.create(data);
  res.status(201).json(voyage);
};

// PUT /voyages/:id  (ADMIN)
export const update = async (req: Request, res: Response) => {
  const data = { ...req.body };
  if ((req as any).file) data.image = (req as any).file.filename;
  const voyage = await Voyage.findByIdAndUpdate(req.params.id, data, {
    new: true,
  });
  res.json(voyage);
};

// DELETE /voyages/:id  (ADMIN)
export const remove = async (req: Request, res: Response) => {
  await Voyage.findByIdAndDelete(req.params.id);
  res.json({ message: "Voyage deleted" });
};

import express from "express";
import Requirement from "../models/Requirement.js";
import { requirementSchema } from "../validators/requirementSchema.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const parsed = requirementSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Validation failed", errors: parsed.error.flatten() });
  }

  const doc = await Requirement.create(parsed.data);
  res.status(201).json(doc);
});

router.get("/", async (req, res) => {
  const { hireType } = req.query;

  const filter = {};
  if (hireType && ["planner", "performer", "crew"].includes(String(hireType))) {
    filter.hireType = String(hireType);
  }

  const docs = await Requirement.find(filter).sort({ createdAt: -1 });
  res.json(docs);
});


router.get("/:id", async (req, res) => {
  const doc = await Requirement.findById(req.params.id);
  if (!doc) return res.status(404).json({ message: "Not found" });
  res.json(doc);
});

export default router;

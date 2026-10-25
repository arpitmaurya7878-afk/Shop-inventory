import mongoose from "mongoose";
import Product from "../models/Product.js";

function prepare(body = {}) {
  const p = { ...body };
  for (const k of ["productName", "supplierName"])
    if (typeof p[k] === "string") p[k] = p[k].trim();
  const hasDiscount =
    p.discountPercentage !== undefined &&
    p.discountPercentage !== null &&
    p.discountPercentage !== "";
  p.discountPercentage = hasDiscount ? Number(p.discountPercentage) : null;
  for (const k of ["mrp", "stockQuantity", "finalSellingPrice"])
    if (p[k] !== undefined && p[k] !== null && p[k] !== "") p[k] = Number(p[k]);
  if (
    hasDiscount &&
    Number.isFinite(p.mrp) &&
    Number.isFinite(p.discountPercentage)
  )
    p.finalSellingPrice =
      Math.round(
        (p.mrp * (1 - p.discountPercentage / 100) + Number.EPSILON) * 100,
      ) / 100;
  return p;
}
function validate(p) {
  const e = [];
  for (const [k, label] of [
    ["productName", "Product name"],
    ["supplierName", "Supplier name"],
    ["mrp", "MRP"],
  ])
    if (p[k] === undefined || p[k] === null || p[k] === "" || p[k] === "")
      e.push(`${label} is required`);
  if (
    p.finalSellingPrice === undefined ||
    p.finalSellingPrice === null ||
    p.finalSellingPrice === ""
  )
    e.push("Final selling price is required when no discount is entered");
  if (p.productName !== undefined && !String(p.productName).trim())
    e.push("Product name is required");
  if (p.supplierName !== undefined && !String(p.supplierName).trim())
    e.push("Supplier name is required");
  for (const k of [
    "mrp",
    "finalSellingPrice",
    "discountPercentage",
    "stockQuantity",
  ]) {
    const v = p[k];
    if (v === null || v === undefined || v === "") continue;
    if (!Number.isFinite(v)) e.push(`${k} must be a valid number`);
    else if (v < 0) e.push(`${k} cannot be negative`);
  }
  if (
    p.discountPercentage !== null &&
    p.discountPercentage !== undefined &&
    p.discountPercentage > 100
  )
    e.push("Discount cannot exceed 100%");
  if (p.stockQuantity !== undefined && !Number.isInteger(p.stockQuantity))
    e.push("Stock quantity must be a whole number");
  return e;
}
const badId = (id) => !mongoose.isValidObjectId(id);
export async function create(req, res, next) {
  try {
    const p = prepare(req.body),
      e = validate(p);
    if (e.length) return res.status(400).json({ message: e[0] });
    const product = await Product.create(p);
    res.status(201).json({ message: "Product created successfully.", product });
  } catch (e) {
    next(e);
  }
}
export async function list(req, res, next) {
  try {
    const s = String(req.query.search || "").trim();
    const filter = s
      ? {
          $or: [
            { productName: { $regex: escape(s), $options: "i" } },
            { supplierName: { $regex: escape(s), $options: "i" } },
          ],
        }
      : {};
    const products = await Product.find(filter)
      .sort({ createdAt: -1, _id: -1 })
      .lean();
    res.json({ count: products.length, products });
  } catch (e) {
    next(e);
  }
}
export async function getOne(req, res, next) {
  try {
    if (badId(req.params.id))
      return res.status(400).json({ message: "Invalid product ID" });
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ product });
  } catch (e) {
    next(e);
  }
}
export async function update(req, res, next) {
  try {
    if (badId(req.params.id))
      return res.status(400).json({ message: "Invalid product ID" });
    const p = prepare(req.body),
      e = validate(p);
    if (e.length) return res.status(400).json({ message: e[0] });
    const product = await Product.findByIdAndUpdate(req.params.id, p, {
      new: true,
      runValidators: true,
    });
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product updated successfully.", product });
  } catch (e) {
    next(e);
  }
}
export async function remove(req, res, next) {
  try {
    if (badId(req.params.id))
      return res.status(400).json({ message: "Invalid product ID" });
    const p = await Product.findByIdAndDelete(req.params.id);
    if (!p) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully." });
  } catch (e) {
    next(e);
  }
}
export async function stock(req, res, next) {
  try {
    if (badId(req.params.id))
      return res.status(400).json({ message: "Invalid product ID" });
    const down = req.params.action === "decrease-stock";
    const filter = {
      _id: req.params.id,
      ...(down ? { stockQuantity: { $gt: 0 } } : {}),
    };
    const product = await Product.findOneAndUpdate(
      filter,
      { $inc: { stockQuantity: down ? -1 : 1 } },
      { new: true, runValidators: true },
    );
    if (!product) {
      const exists = await Product.exists({ _id: req.params.id });
      if (!exists)
        return res.status(404).json({ message: "Product not found" });
      return res.status(409).json({ message: "Stock cannot go below zero" });
    }
    res.json({
      message: down
        ? "Stock decreased successfully."
        : "Stock increased successfully.",
      product,
    });
  } catch (e) {
    next(e);
  }
}
function escape(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

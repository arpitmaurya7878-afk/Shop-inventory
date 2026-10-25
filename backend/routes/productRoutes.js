import { Router } from "express";
import {
  create,
  list,
  getOne,
  update,
  remove,
  stock,
} from "../controllers/productController.js";
const r = Router();
r.route("/").get(list).post(create);
r.patch("/:id/:action(increase-stock|decrease-stock)", stock);
r.route("/:id").get(getOne).put(update).delete(remove);
export default r;

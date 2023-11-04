import { Router } from "express";
import { body, param } from "express-validator";
import Controller from "./controller.js";

const routes = Router({ strict: true });

routes.post(
  "/create",
  [
    body("title", "Must not be empty.").trim().not().isEmpty().escape(),
    body("content", "Must not be empty.").trim().not().isEmpty().escape(),
    body("author", "Must not be empty.").trim().not().isEmpty().escape(),
  ],
  Controller.validation,
  Controller.create
);

routes.get("/posts", Controller.getPosts);

routes.get(
  "/post/:id",
  [param("id", "Invalid post id.").exists().isNumeric().toInt()],
  Controller.validation,
  Controller.getPosts
);

routes.put(
  "/update-post/:id",
  [
    param("id", "Invalid post id.").exists().isNumeric().toInt(),
    body("title", "Must not be empty.").trim().not().isEmpty().escape(),
    body("content", "Must not be empty.").trim().not().isEmpty().escape(),
    body("author", "Must not be empty.").trim().not().isEmpty().escape(),
  ],
  Controller.validation,
  Controller.updatePost
);

routes.delete(
  "/delete-post",
  [body("post_id", "Invalid post id.").exists().isNumeric().toInt()],
  Controller.validation,
  Controller.deletePost
);

export default routes;

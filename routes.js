import { Router } from "express";
import { body } from "express-validator";
import Controller from "./controller.js";

const routes = Router({ strict: true });

routes.post("/create",
  [
    body("title", "Must not be empty.").trim().not().isEmpty().escape(),
    body("content", "Must not be empty.").trim().not().isEmpty().escape(),
    body("author", "Must not be empty.").trim().not().isEmpty().escape(),
  ],
  Controller.validation,
  Controller.create,
);

// TODO: GET 
routes.get('/get')


export default routes;
import { matchedData, validationResult } from "express-validator";
import createApiResponse from "./api_response.js";
import { pool } from "./database.js";

const validation_result = validationResult.withDefaults({
  formatter: (error) => error.msg,
});

class Controller {
  static validation = (req, res, next) => {
    const errors = validation_result(req).mapped();
    if (Object.keys(errors).length) {
      return res.status(422).json({
        ok: 0,
        status: 422,
        errors,
      });
    }
    next();
  };

  static create = (req, res, next) => {
    const { title, content, author } = matchedData(req);
    try {
      pool.query(
        "INSERT INTO posts (title,content,author) VALUES ($1,$2,$3) RETURNING *",
        [title, content, author],
        (error, results) => {
          if (error) {
            throw error;
          }
          var postId = results.rows[0].id;
          var successResponse = createApiResponse({
            success: true,
            status: 201,
            data: {
              postId: postId,
            },
            message: "Post created successfully",
          });
          res.status(201).json(successResponse);
        }
      );
    } catch (e) {
      next(e);
    }
  };

  static getAllPosts = (req,res,next) => {
    try {
      pool.query(
        'SELECT * FROM posts',
        (error,results) => {
          if(error) {
            throw error;
          } 
          var successResponse = createApiResponse(
            {
              success: true,
              status: 200,
              data: results.rows,
            }
          );
          res.status(200).json(successResponse);
        }
      );
    } catch (e) {
      next(e);
    }
  };
}

export default Controller;

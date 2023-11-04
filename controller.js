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

  static create = async (req, res, next) => {
    const { title, content, author } = matchedData(req);
    try {
      const data = await pool.query(
        "INSERT INTO posts (title,content,author) VALUES ($1,$2,$3) RETURNING *",
        [title, content, author]
      );

      var postId = data.rows[0].id;
      var successResponse = createApiResponse({
        success: true,
        status: 201,
        message: "Post created successfully",
        postId: postId,
      });
      res.status(201).json(successResponse);
    } catch (e) {
      next(e);
    }
  };

  static getPosts = async (req, res, next) => {
    try {
      let sql = "SELECT * FROM posts";
      if (req.params.id) {
        sql = `SELECT * FROM POSTS WHERE id=${req.params.id}`;
      }
      const data = await pool.query(sql);
      if (data.rows.length === 0 && req.params.id) {
        var errorResponse = createApiResponse({
          success: false,
          status: 404,
          message: "Invalid post ID.",
        });
        res.status(404).json(errorResponse);
      } else {
        const post = req.params.id ? data.rows[0] : data.rows;
        var successResponse = createApiResponse({
          success: true,
          status: 200,
          post,
        });
        res.status(200).json(successResponse);
      }
    } catch (e) {
      next(e);
    }
  };

  static updatePost = async (req, res, next) => {
    try {
      const data = matchedData(req);
      const postData = await pool.query(`SELECT * FROM posts WHERE id=$1`, [
        req.params.id,
      ]);
      if (postData.rows.length !== 1 && req.params.id) {
        var errorResponse = createApiResponse({
          success: false,
          status: 404,
          message: "Invalid post ID.",
        });
        res.json(errorResponse);
      } else {
        const post = postData.rows[0];
        const date = new Date().toISOString();
        const title = data.title || post.title;
        const content = data.body || post.content;
        const author = data.author || post.author;
        const result = await pool.query(
          "UPDATE posts SET title=$1, content=$2, author=$3, updated_at=$4 WHERE id=$5 RETURNING *",
          [title, content, author, date, req.params.id]
        );
        var successResponse = createApiResponse({
          success: true,
          status: 200,
          message: "Post updated successfully",
          postId: result.rows[0].id,
        });
        res.json(successResponse);
      }
    } catch (e) {
      next(e);
    }
  };

  static deletePost = async (req, res, next) => {
    try {
      const data = await pool.query(
        "DELETE FROM posts WHERE id=$1 RETURNING *",
        [req.body.post_id]
      );
      if (data.rows.length !== 0) {
        var successResponse = createApiResponse({
          success: true,
          status: 200,
          message: "Post has been deleted successfully",
        });
        res.status(200).json(successResponse);
      } else {
        var errorResponse = createApiResponse({
          success: false,
          status: 404,
          message: "Invalid post ID.",
        });
        res.status(404).json(errorResponse);
      }
    } catch (e) {
      next(e);
    }
  };
}

export default Controller;

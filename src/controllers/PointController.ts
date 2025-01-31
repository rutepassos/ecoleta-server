import { Request, Response } from "express";
import knex from "../database/connection";

class PointController {
  async index(req: Request, resp: Response) {
    const { city, uf, items } = req.query;

    const parsedItems = String(items)
      .split(",")
      .map((item) => Number(item.trim()));

    const points = await knex
      .table("points")
      .join("point_items", "points.id", "=", "point_items.point_id")
      .whereIn("point_items.item_id", parsedItems)
      .where("city", String(city))
      .where("uf", String(uf))
      .distinct()
      .select("points.*");

    return resp.json(points);
  }

  async show(req: Request, resp: Response) {
    const { id } = req.params;
    const point = await knex.table("points").where("id", id).first();

    if (!point) {
      return resp.status(400).json({ message: "point not found" });
    }

    const items = await knex
      .table("items")
      .select("title")
      .join("point_items", "items.id", "=", "point_items.item_id")
      .where("point_items.point_id", id);

    return resp.json({ point, items });
  }

  async create(req: Request, resp: Response) {
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = req.body;

    const trx = await knex.transaction();

    const point = {
      name,
      image:
        "https://images.unsplash.com/photo-1556767576-5ec41e3239ea?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60",
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    };

    const insertedIds = await trx("points").insert(point);

    const point_id = insertedIds[0];
    const pointItems = items.map((item_id: number) => {
      return {
        item_id,
        point_id,
      };
    });

    await trx("point_items").insert(pointItems);

    await trx.commit();

    return resp.json({ point_id, ...point });
  }
}

export default PointController;

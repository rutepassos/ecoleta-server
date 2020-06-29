import { Request, Response } from "express";
import knex from "../database/connection";

class ItemController {
  async index(req: Request, resp: Response) {
    const items = await knex.table("items").select("*");

    const serializeItems = items.map((item) => {
      return {
        id: item.id,
        title: item.title,
        image_url: `http://192.168.0.106:3333/uploads/${item.image}`,
      };
    });

    return resp.json(serializeItems);
  }
}

export default ItemController;

import express from "express";

import PointController from "./controllers/PointController";
import ItemController from "./controllers/ItemController";

const routes = express.Router();

const points = new PointController();
const items = new ItemController();

routes.get("/items", items.index);

routes.get("/points", points.index);
routes.get("/points/:id", points.show);
routes.post("/points", points.create);

export default routes;

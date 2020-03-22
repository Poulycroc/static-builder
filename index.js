/**
 * @package     freecaster/skin-builder
 * @component   ThemeBuilder
 * @author      Maxime Bartier <maxime.bartier@freecaster.com>
 * @copyright   Freecaster SPRL 2019
 */
const express = require("express");
const consola = require("consola");

require("dotenv").config();

const app = express();
const server = require("http").createServer(app);

const buildSass = require("./server/builder");

server.listen(process.env.RUN_PORT, err => {
  if (err) return consola.error(err);
  consola.success("🍺 Freecaster SkinBuilder");
  consola.success(`🍕 App listen on port: ${process.env.RUN_PORT}`);
  consola.success(`🦄 Env: ${process.env.NODE_ENV}`);

  buildSass();
});

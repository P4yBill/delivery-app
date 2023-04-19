import app from "./src/config/app";
import { ENV } from "./src/config/env";
import RedisService from "./src/services/redis-service";
import { connectToMongodb } from "./src/utils/database";
import { logger } from "./src/utils/logger";

async function main() {
  await connectToMongodb();
  await RedisService.getInstance().connect();

  app.listen(ENV.port, () => {
    logger.info(`⚡️[server]: Server is running at http://localhost:${ENV.port}`)
  });
}

main();
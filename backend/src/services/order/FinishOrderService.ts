import prismaClient from "../../prisma";

import { OrderRequest } from "./SendOrderService";

class FinishOrderService {
  async execute({ order_id }: OrderRequest) {
    const order = await prismaClient.order.update({
      where: {
        id: order_id,
      },
      data: {
        status: true,
      },
    });

    return order;
  }
}

export { FinishOrderService };

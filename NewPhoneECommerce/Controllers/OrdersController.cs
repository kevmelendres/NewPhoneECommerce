using API.Dtos;
using API.Helpers;
using Core.Interfaces;
using Core.Models;
using Core.Specifications;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class OrdersController : BaseController
    {
        private readonly IGenericRepository<Order> _orderRepository;
        private readonly IGenericRepository<DeliveryMethod> _deliveryMethodRepo;
        private readonly IGenericRepository<OrderItem> _orderItemRepo;

        public OrdersController(IGenericRepository<Order> orderRepo,
            IGenericRepository<DeliveryMethod> deliveryMethodRepo,
            IGenericRepository<OrderItem> orderItemRepo)
        {
            _orderRepository = orderRepo;
            _deliveryMethodRepo = deliveryMethodRepo;
            _orderItemRepo = orderItemRepo;
        }

        [HttpPost]
        [Route("DeliveryMethod/Add")]
        public async Task<ActionResult<string>> AddDeliveryMethod(
            [FromBody] DeliveryMethodDto newDeliveryMethod)
        {

            DeliveryMethod toAddDeliveryMethod = new()
            {
                Name = newDeliveryMethod.Name!,
                DeliveryDays = newDeliveryMethod.DeliveryDays,
                Description = newDeliveryMethod.Description!,
                Price = newDeliveryMethod.Price,
            };

            var result = await _deliveryMethodRepo.AddItem(toAddDeliveryMethod);
            if (result != "Failed")
            {
                return result;
            }

            return Json("Failed");
        }

        [HttpPost]
        [Route("DeliveryMethod/Delete")]

        public async Task<ActionResult<string>> DeleteDeliveryMethod(
            [FromQuery] int deliveryMethodId)
        {
            var result = await _deliveryMethodRepo.DeleteItem(deliveryMethodId);
            
            if (result == "Success")
            {
                return Json("Success");
            }

            return Json("Failed");
        }

        [HttpGet]
        [Route("DeliveryMethod/GetAllItems")]

        public async Task<IReadOnlyList<DeliveryMethodDto>> GetAllDeliveryMethods()
        {
            var paramSpecs = new DeliveryMethodSpecParams();
            var items = await _deliveryMethodRepo.GetAllItems(paramSpecs);

            return MapperHelper.MapDeliveryMethodList(items);
        }

        [HttpPost]
        [Route("Order/Create")]
        public async Task<ActionResult<string>> CreateOrder([FromBody] OrderDto order)
        {
            var newOrder = new Order()
            {
                BuyerEmail = order.BuyerEmail,
                ShippingAddress = order.ShippingAddress,
                SubTotal = order.Subtotal,
                DeliveryMethodId = order.DeliveryMethodId,
            };

            var result = await _orderRepository.AddItem(newOrder);

            if (result != "Failed")
            {
                int orderId = -1;
                if (Int32.TryParse(result, out orderId)) {
                    return Ok(orderId.ToString());
                };

                return Json("Creating order failed.");
            }

            return Json("Creating order failed.");
        }

    }
}

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

            DeliveryMethodEnum deliveryMethodName = newDeliveryMethod.Name switch
            {
                "SameDayDelivery" => DeliveryMethodEnum.SameDayDelivery,
                "OvernightDelivery" => DeliveryMethodEnum.OvernightDelivery,
                "NormalDelivery" => DeliveryMethodEnum.NormalDelivery,
                "SaverDelivery" => DeliveryMethodEnum.SaverDelivery,
                _ => DeliveryMethodEnum.NormalDelivery
            }; 

            DeliveryMethod toAddDeliveryMethod = new()
            {
                Name = deliveryMethodName,
                DeliveryDays = newDeliveryMethod.DeliveryDays,
                Description = newDeliveryMethod.Description!,
                Price = newDeliveryMethod.Price,
            };

            var result = await _deliveryMethodRepo.AddItem(toAddDeliveryMethod);
            if (result == "Success")
            {
                return Json("Success");
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

    }
}

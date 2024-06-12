using System.Globalization;
using API.Dtos;
using API.Helpers;
using Core.Interfaces;
using Core.Models;
using Core.Specifications;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class AdminController : BaseController
    {
        private readonly IGenericRepository<Order> _orderRepository;
        private readonly IGenericRepository<DeliveryMethod> _deliveryMethodRepo;
        private readonly IGenericRepository<OrderItem> _orderItemRepo;
        
        public AdminController(IGenericRepository<Order> orderRepo,
            IGenericRepository<DeliveryMethod> deliveryMethodRepo,
            IGenericRepository<OrderItem> orderItemRepo)
        {
            _orderRepository = orderRepo;
            _deliveryMethodRepo = deliveryMethodRepo;
            _orderItemRepo = orderItemRepo;
        }

        [HttpGet]
        [Route("GetOrders")]
        public async Task<ActionResult<string>> GetOrders(
            [FromQuery] int pageNumber, [FromQuery] int itemsToShow,
            [FromQuery] string? orderStatus
            )
        {
            var paramSpecs = new OrderSpecParams();
            paramSpecs.ItemsToShow = itemsToShow;
            paramSpecs.PageNumber = pageNumber;

            if ( orderStatus != null )
            {
                paramSpecs.Criteria = x => x.OrderStatus == orderStatus.ToOrderStatus();
            }

            var data = await _orderRepository.GetAllItems(paramSpecs);
            var returnData = MapperHelper.MapOrderList(data);

            return Ok(returnData);
        }

    }
}

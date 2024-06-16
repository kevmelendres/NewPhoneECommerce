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
            var ordersList = MapperHelper.MapOrderList(data);

            foreach (OrderGetDetailedDto order in ordersList)
            {
                foreach (var orderItem in order.OrderItems)
                {
                    var paramOrderItemSpecs = new OrderItemSpecParams();
                    var orderItemGet = await _orderItemRepo.GetItemById(orderItem.OrderItemId, paramOrderItemSpecs);

                    orderItem.Id = orderItemGet.ProductId;
                    orderItem.Brand = orderItemGet.Product.Brand;
                    orderItem.Model = orderItemGet.Product.Model;
                    orderItem.DeviceOS = orderItemGet.Product.DeviceOS;
                    orderItem.ReleaseDate = orderItemGet.Product.ReleaseDate;
                    orderItem.Price = orderItemGet.Product.Price;
                    orderItem.Color = orderItemGet.Product.Color;
                    orderItem.Description = orderItemGet.Product.Description;
                    orderItem.Image = orderItemGet.Product.Image;
                    orderItem.Seller = orderItemGet.Product.Seller.Name;
                    orderItem.PreviousOwner = orderItemGet.Product.PreviousOwner.FirstName;
                    orderItem.Rating = orderItemGet.Product.Rating;
                    orderItem.Discount = orderItemGet.Product.Discount;
                    orderItem.AvailableStocks = orderItemGet.Product.AvailableStocks;
                    orderItem.SoldItems = orderItemGet.Product.SoldItems;
                    orderItem.DiscountedPrice = orderItemGet.Product.DiscountedPrice;
                }
            }

            return Ok(ordersList);
        }

        [HttpPost]
        [Route("Order/EditOrderStatus")]
        public async Task<ActionResult<string>> EditOrderStatus(
            [FromBody] OrderEditStatusDto orderEditStatus)
        {
            var orderSpecs = new OrderSpecParams();
            orderSpecs.Criteria = x => x.Id == orderEditStatus.OrderId;

            var orderToEdit = await _orderRepository.GetItemById(orderEditStatus.OrderId, orderSpecs);
            orderToEdit.OrderStatus = orderEditStatus.OrderStatus.ToOrderStatus();
            Console.WriteLine(orderToEdit.OrderStatus);

            var result = await _orderRepository.EditItem(orderEditStatus.OrderId, orderToEdit);

            if (result == "Success")
            {
                return Json("Success");
            }

            return Json("Failed");
        }
    }
}

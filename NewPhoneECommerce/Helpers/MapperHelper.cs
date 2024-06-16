using System.Linq.Expressions;
using API.Dtos;
using Core.Models;

namespace API.Helpers
{
    public static class MapperHelper
    {
        public static IReadOnlyList<ProductToReturnDto> MapProductList(IReadOnlyList<Product> dataList)
        {
            var newList = new List<ProductToReturnDto>();

            foreach (var item in dataList)
            {
                newList.Add(MapProductItem(item));
            }

            return newList;
        }

        public static ProductToReturnDto MapProductItem(Product item)
        {
            var addItem = new ProductToReturnDto();
            addItem.Id = item.Id;
            addItem.Brand = item.Brand;
            addItem.Model = item.Model;
            addItem.DeviceOS = item.DeviceOS;
            addItem.ReleaseDate = item.ReleaseDate;
            addItem.Price = item.Price;
            addItem.Color = item.Color;
            addItem.Description = item.Description;
            addItem.Image = item.Image;
            addItem.Rating = item.Rating;
            addItem.Discount = item.Discount;
            addItem.AvailableStocks = item.AvailableStocks;
            addItem.SoldItems = item.SoldItems;
            addItem.DiscountedPrice = item.DiscountedPrice;

            if (item.Seller != null)
            {
                addItem.Seller = item.Seller.Name;
            }

            if (item.Seller != null)
            {
                addItem.PreviousOwner = item.PreviousOwner.FirstName;
            }

            return addItem;
        }

        public static IReadOnlyList<DeliveryMethodDto> MapDeliveryMethodList(IReadOnlyList<DeliveryMethod> dataList)
        {
            var newList = new List<DeliveryMethodDto>();

            foreach (var item in dataList)
            {
                newList.Add(MapDeliveryMethod(item));
            }

            return newList;
        }

        public static DeliveryMethodDto MapDeliveryMethod(DeliveryMethod item)
        {
            return new DeliveryMethodDto {
                Id = item.Id,
                Name = item.Name.ToString(),
                Description = item.Description,
                Price = item.Price,
                DeliveryDays = item.DeliveryDays,
            };
        }

        public static OrderGetDetailedDto MapOrder(Order order)
        {

            OrderGetDetailedDto orderGetDetailedDto = new()
            {
                OrderId = order.Id,
                BuyerEmail = order.BuyerEmail,
                FirstName = order.FirstName,
                LastName = order.LastName,
                AddressCountry = order.AddressCountry,
                AddressRegion = order.AddressRegion,
                AddressProvince = order.AddressProvince,
                AddressBarangay = order.AddressBarangay,
                AddressMunicipality = order.AddressMunicipality,
                AddressZipCode = order.AddressZipCode,
                AddressStreet = order.AddressStreet,
                DeliveryMethod = order.DeliveryMethod.Name,
                Subtotal = order.SubTotal,
                OrderStatus = order.OrderStatus.ToString(),
                OrderDate = order.OrderDate.ToString(),
                DeliveryMethodId = order.DeliveryMethodId,
                DeliveryMethodPrice = order.DeliveryMethod.Price,
                DeliveryMethodDays = order.DeliveryMethod.DeliveryDays,
            };

            foreach (OrderItem orderItem in order.OrderItems)
            {
                Console.WriteLine(orderItem.ProductId);

                orderGetDetailedDto.OrderItems.Add(new OrderItemGetDetailedDto
                {
                    OrderItemId = orderItem.Id,
                    Quantity = orderItem.Quantity,
                    OrderId = orderItem.OrderId,
                });
            }

            return orderGetDetailedDto;
        }

        public static IReadOnlyList<OrderGetDetailedDto> MapOrderList(IReadOnlyList<Order> orderList)
        {
            var newList = new List<OrderGetDetailedDto>();

            foreach (var item in orderList)
            {
                newList.Add(MapOrder(item));
            }

            return newList;
        }

        public static OrderStatusEnum ToOrderStatus(this string orderStatus)
        {

            switch (orderStatus.TrimEnd())
            {
                case "Order Placed":
                    return OrderStatusEnum.OrderPlaced;

                case "Order In Progress":
                    Console.WriteLine("SET TO ORDER IN PROGRESS");
                    return OrderStatusEnum.OrderInProgress;

                case "Preparing To Ship":
                    return OrderStatusEnum.PreparingToShip;

                case "Shipped":
                    return OrderStatusEnum.Shipped;

                case "Delivered":
                    return OrderStatusEnum.Delivered;

                default:
                    return OrderStatusEnum.OrderPlaced;
            }
        }

        public static Order MapOrderDtoToOrder(OrderDto order)
        {

            Order orderToReturn = new()
            {
                BuyerEmail = order.BuyerEmail,
                FirstName = order.FirstName,
                LastName = order.LastName,

                AddressCountry = order.AddressCountry,
                AddressRegion = order.AddressRegion,
                AddressProvince = order.AddressProvince,
                AddressMunicipality = order.AddressMunicipality,
                AddressBarangay = order.AddressBarangay,
                AddressZipCode = order.AddressZipCode,
                AddressStreet = order.AddressStreet,

                SubTotal = order.Subtotal,
                DeliveryMethodId = order.DeliveryMethodId,
            };

            if (order.OrderStatus != null)
                orderToReturn.OrderStatus = order.OrderStatus.ToOrderStatus();

            return orderToReturn;
        }

        
    }
}

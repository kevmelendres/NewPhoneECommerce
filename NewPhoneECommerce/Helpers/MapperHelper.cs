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
    }
}

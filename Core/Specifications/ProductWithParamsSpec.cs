using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using Core.Models;

namespace Core.Specifications
{
    public class ProductWithParamsSpec : ProductWithSellerAndPrevOwnerSpec
    {
        public ProductWithParamsSpec(ProductSpecParams paramSpecs) : base()
        {
            this.Criteria = x => (!paramSpecs.SellerId.HasValue || x.SellerID == paramSpecs.SellerId) &&
                    (!paramSpecs.PrevOwnerId.HasValue || x.PrevOwnerID == paramSpecs.PrevOwnerId) &&
                    (paramSpecs.SearchString == null || x.Model.ToString().ToLower().Contains(paramSpecs.SearchString.ToLower())) &&
                    (paramSpecs.BrandName == null || x.Brand == paramSpecs.BrandName) &&
                    (paramSpecs.Seller == null || x.Seller.Name == paramSpecs.Seller) &&
                    (paramSpecs.Availability == null || (paramSpecs.Availability == "In Stock" ? x.AvailableStocks > 0 : x.AvailableStocks <= 0));

            this.PageNumber = paramSpecs.PageNumber;
            this.ItemsToShow = paramSpecs.ItemsToShow;
            this.OrderBy = x => x.Price; //default sorting

            if (paramSpecs.SortBy != null)
            {
                this.OrderBy = null;

                if (paramSpecs.SortBy == "Price: Low-to-High")
                {
                    this.OrderBy = x => x.DiscountedPrice;
                }

                if (paramSpecs.SortBy == "Price: High-to-Low")
                {
                    this.OrderByDescending = x => x.DiscountedPrice;
                }

                if (paramSpecs.SortBy == "Average Rating")
                {
                    this.OrderByDescending = x => x.Rating;
                }

                if (paramSpecs.SortBy == "Latest")
                {
                    this.OrderByDescending = x => x.ReleaseDate;
                }

                if (paramSpecs.SortBy == "Availability")
                {
                    this.OrderByDescending = x => x.AvailableStocks;
                }

                //For AdminProductService of Frontend

                if (paramSpecs.SortBy == "sortProductIdAscending")
                {
                    this.OrderBy = x => x.Id;
                }

                if (paramSpecs.SortBy == "sortProductIdDescending")
                {
                    this.OrderByDescending = x => x.Id;
                }

                if (paramSpecs.SortBy == "sortModelAscending")
                {
                    this.OrderBy = x => x.Model;
                }

                if (paramSpecs.SortBy == "sortModelDescending")
                {
                    this.OrderByDescending = x => x.Model;
                }
                if (paramSpecs.SortBy == "sortBrandAscending")
                {
                    this.OrderBy = x => x.Brand;
                }

                if (paramSpecs.SortBy == "sortBrandDescending")
                {
                    this.OrderByDescending = x => x.Brand;
                }

                if (paramSpecs.SortBy == "sortColorAscending")
                {
                    this.OrderBy = x => x.Color;
                }

                if (paramSpecs.SortBy == "sortColorDescending")
                {
                    this.OrderByDescending = x => x.Color;
                }

                if (paramSpecs.SortBy == "sortPriceAscending")
                {
                    this.OrderBy = x => x.Price;
                }

                if (paramSpecs.SortBy == "sortPriceDescending")
                {
                    this.OrderByDescending = x => x.Price;
                }

                if (paramSpecs.SortBy == "sortDiscountAscending")
                {
                    this.OrderBy = x => x.Discount;
                }

                if (paramSpecs.SortBy == "sortDiscountDescending")
                {
                    this.OrderByDescending = x => x.Discount;
                }

                if (paramSpecs.SortBy == "sortDiscountedPriceAscending")
                {
                    this.OrderBy = x => x.DiscountedPrice;
                }

                if (paramSpecs.SortBy == "sortDiscountedPriceDescending")
                {
                    this.OrderByDescending = x => x.DiscountedPrice;
                }

                if (paramSpecs.SortBy == "sortAvailableStocksAscending")
                {
                    this.OrderBy = x => x.AvailableStocks;
                }

                if (paramSpecs.SortBy == "sortAvailableStocksDescending")
                {
                    this.OrderByDescending = x => x.AvailableStocks;
                }
                if (paramSpecs.SortBy == "sortItemsSoldAscending")
                {
                    this.OrderBy = x => x.SoldItems;
                }

                if (paramSpecs.SortBy == "sortItemsSoldDescending")
                {
                    this.OrderByDescending = x => x.SoldItems;
                }
            }

        }
    }
}

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
                    (!paramSpecs.PrevOwnerId.HasValue || x.PrevOwnerID == paramSpecs.PrevOwnerId);
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
            }

        }
    }
}

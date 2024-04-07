using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models
{
    public class Product : BaseEntity
    {
        public string Brand { get; set; }
        public string Model { get; set; }
        public string DeviceOS { get; set; }
        public int ReleaseDate { get; set; }
        public int Price { get; set; }
        public string Color { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }

        [ForeignKey("Seller")]
        public int SellerID { get; set; }
        public Seller Seller { get; set; }

        [ForeignKey("PreviousOwner")]
        public int PrevOwnerID { get; set; }
        public PreviousOwner PreviousOwner { get; set; }

        public double Rating { get; set; }
        public int Discount { get; set; }
        public int AvailableStocks { get; set; }
        public int SoldItems { get; set; }
    }
}

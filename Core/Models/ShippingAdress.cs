using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models
{
    public class ShippingAdress
    {
        public string Region { get; set; }
        public string Province { get; set; }
        public string Municipality { get; set; }
        public string Barangay { get; set; }
        public string Street { get; set; }
        public string ZipCode { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Models.Identity
{
    public class Address
    {
        public int Id { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Street { get; set; }
        public string? Region { get; set; }
        public string? Province { get; set; }
        public string? Zipcode { get; set; }
        public string? Municipality { get; set; }
        public string? Barangay { get; set; }
        public string? AppUserId { get; set; }
        public AppUser AppUser { get; set; }
    }
}

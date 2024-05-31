using Core.Models;

namespace API.Dtos
{
    public class DeliveryMethodDto
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public int DeliveryDays { get; set; }
        public string? Description { get; set; }
        public double Price { get; set; }
    }

}

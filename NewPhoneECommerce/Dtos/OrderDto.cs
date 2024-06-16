
namespace API.Dtos
{
    public class OrderDto
    {
        public string BuyerEmail { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string? AddressCountry { get; set; }
        public string? AddressRegion { get; set; }
        public string? AddressProvince { get; set; }
        public string? AddressMunicipality { get; set; }
        public string? AddressBarangay { get; set; }
        public int? AddressZipCode { get; set; }
        public string? AddressStreet { get; set; }
        public int DeliveryMethodId { get; set; }
        public double Subtotal { get; set; }
        public string? OrderStatus { get; set; }
    }
}

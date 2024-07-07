namespace API.Dtos
{
    public class ProductToAddDto
    {
        public string? Brand { get; set; }
        public string? Model { get; set; }
        public string? DeviceOS { get; set; }
        public int? ReleaseDate { get; set; }
        public int? Price { get; set; }
        public string? Color { get; set; }
        public string? Description { get; set; }
        public string? Image { get; set; }
        public string? Seller { get; set; }
        public string? PreviousOwnerFirstName { get; set; }
        public string? PreviousOwnerLastName { get; set; }
        public double? Rating { get; set; }
        public int? Discount { get; set; }
        public int? AvailableStocks { get; set; }
        public int? SoldItems { get; set; }
    }
}

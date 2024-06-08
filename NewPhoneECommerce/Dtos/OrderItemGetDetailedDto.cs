namespace API.Dtos
{
    public class OrderItemGetDetailedDto : ProductToReturnDto
    {
        public int OrderId { get; set; }
        public int Quantity { get; set; }
        public int OrderItemId { get; set; }
    }
}

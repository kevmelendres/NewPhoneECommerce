namespace API.Dtos
{
    public class EditUserDto
    {
        public string? DisplayName { get; set; }
        public string? Email { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Municipality { get; set; }
        public string? Province { get; set; }
        public string? Region { get; set; }
        public string? Street { get; set; }
        public string? Zipcode { get; set; }
        public string? Barangay { get; set; }
        public string? Password { get; set; }
    }

}

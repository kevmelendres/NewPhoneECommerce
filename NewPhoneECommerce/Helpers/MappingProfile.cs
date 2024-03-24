using API.Dtos;
using AutoMapper;
using Core.Models;

namespace API.Helpers
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Product, ProductToReturnDto>()
                .ForMember(d => d.PreviousOwner, o => o.MapFrom(s => s.PreviousOwner.FirstName))
                .ForMember(d => d.Seller, o => o.MapFrom(s => s.Seller.Name));
        }
    }
}

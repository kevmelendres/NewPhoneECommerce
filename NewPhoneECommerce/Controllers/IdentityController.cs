using API.Dtos;
using Azure;
using Core.Models.Identity;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class IdentityController : BaseController
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IConfiguration _configuration;

        public IdentityController(
            UserManager<AppUser> userManager,
            RoleManager<IdentityRole> roleManager,
            SignInManager<AppUser> signInManager,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _signInManager = signInManager;
        }

        [HttpPost]
        [Route("register")]
        public async Task<ActionResult<UserDto>> Register([FromBody] RegisterModel model)
        {
            var userExists = await _userManager.FindByNameAsync(model.DisplayName);

            if (userExists != null)
            {
                return BadRequest("Already exists");
            }

            var user = new AppUser()
            {
                DisplayName = model.DisplayName,
                Email = model.Email,
                UserName = model.Email
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (result.Succeeded)
            {
                return new UserDto
                {
                    UserName = user.UserName,
                    Token = "This is a token",
                    Email = user.Email
                };
            }

            return BadRequest(result.Errors);
                
        }
    }
}

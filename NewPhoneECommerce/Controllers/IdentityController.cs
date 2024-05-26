﻿using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API.Dtos;
using Core.Models.Identity;
using Infrastructure.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

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
                UserName = model.Email,
            };

            var result = await _userManager.CreateAsync(user, model.Password);

            if (!await _roleManager.RoleExistsAsync(UserRoles.User))
                await _roleManager.CreateAsync(new IdentityRole(UserRoles.User));

            if (await _roleManager.RoleExistsAsync(UserRoles.User))
            {
                await _userManager.AddToRoleAsync(user, UserRoles.User);
            }

            var tokenService = new TokenService(_configuration, _userManager);
            var token = await tokenService.CreateToken(user);

            if (result.Succeeded)
            {
                return new UserDto
                {
                    DisplayName = user.DisplayName,
                    Token = token,
                    Email = user.Email
                };
            }

            return BadRequest(result.Errors);
        }

        [HttpPost]
        [Route("login")]
        public async Task<ActionResult<UserDto>> Login([FromBody] LoginModel model)
        {
            var user = await _userManager.FindByNameAsync(model.Email);

            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {

                var authClaims = new List<Claim>
                {
                    new Claim(ClaimTypes.Name, user.UserName),
                    new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                };

                var tokenService = new TokenService(_configuration, _userManager);
                var token = await tokenService.CreateToken(user);

                return Ok(new UserDto
                {
                    Email = model.Email,
                    DisplayName = user.DisplayName,
                    Token = token
                });
            }
            return Unauthorized();
        }

        [Authorize(Roles = UserRoles.Admin)]
        [HttpPost]
        [Route("register-admin")]
        public async Task<ActionResult<UserDto>> RegisterAdmin([FromBody] RegisterModel model)
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
                UserName = model.Email,
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
                return StatusCode(StatusCodes.Status500InternalServerError);

            if (!await _roleManager.RoleExistsAsync(UserRoles.Admin))
                await _roleManager.CreateAsync(new IdentityRole(UserRoles.Admin));

            if (!await _roleManager.RoleExistsAsync(UserRoles.User))
                await _roleManager.CreateAsync(new IdentityRole(UserRoles.User));

            //admin registered as both admin and user
            if (await _roleManager.RoleExistsAsync(UserRoles.Admin))
            {
                await _userManager.AddToRoleAsync(user, UserRoles.Admin);
            }

            if (await _roleManager.RoleExistsAsync(UserRoles.Admin))
            {
                await _userManager.AddToRoleAsync(user, UserRoles.User);
            }

            var tokenService = new TokenService(_configuration, _userManager);
            var token = await tokenService.CreateToken(user);

            if (result.Succeeded)
            {
                return new UserDto
                {
                    DisplayName = user.DisplayName,
                    Token = token,
                    Email = user.Email
                };
            }

            return BadRequest(result.Errors);
        }


        [Authorize(Roles = UserRoles.User)]
        [HttpPost]
        [Route("delete-user")]
        public async Task<IActionResult> DeleteUser([FromBody] string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            
            if (user == null)
            {
                return BadRequest("User not found.");
            }
            else
            {
                var result = await _userManager.DeleteAsync(user);
                if (result.Succeeded)
                {
                    return Ok("Delete succeeded");
                }
                else
                {
                    return BadRequest("Delete unsuccessful.");
                }
            }
        }

        [HttpGet]
        [Authorize(Roles = UserRoles.User)]
        [Route("validate-token")]
        public ActionResult<string> ValidateToken()
        {
            return Ok(JsonConvert.SerializeObject("You are authorized."));
        }

        //[Authorize(Roles = UserRoles.User)]
        [HttpPost]
        [Route("edit-user")]
        public async Task<ActionResult<string>> EditUser([FromQuery] string? email, [FromQuery] string token)
        {
            var tokenService = new TokenService(_configuration, _userManager);
            var emailFromDecode = tokenService.DecodeToken(token, "email");

            if (email != emailFromDecode)
            {
                return BadRequest("Email sent and email decoded from token do not match.");
            }

            var user = await _userManager.Users.Include(x => x.Address)
                .FirstOrDefaultAsync(y => y.Email == emailFromDecode);

            if (user != null)
            {
                if (user.Address == null)
                {
                    user.Address = new();
                }

                var result = await _userManager.UpdateAsync(user);

                if (result.Succeeded)
                {
                    return Ok("Update success.");
                }

                return BadRequest("User not found.");
            }

            return BadRequest("Update not successful.");
        }
    }
}

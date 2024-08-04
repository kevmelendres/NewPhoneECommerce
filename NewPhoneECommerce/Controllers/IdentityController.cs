using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.IO;
using System.Reflection.Emit;
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
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

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


        [Authorize(Roles = UserRoles.Admin)]
        [HttpPost]
        [Route("delete-user")]
        public async Task<ActionResult<string>> DeleteUser([FromBody] string email)
        {
            Debug.WriteLine(email);
            var user = await _userManager.Users.Include(x => x.Address)
                .FirstOrDefaultAsync(x => x.Email == email);
            
            if (user == null)
            {
                return Json("User not found.");
            }
            else
            {
                var result = await _userManager.DeleteAsync(user);
                if (result.Succeeded)
                {
                    return Json("Delete succeeded.");
                }
                else
                {
                    return Json("Delete unsuccessful.");
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

        [Authorize(Roles = UserRoles.User)]
        [HttpPost]
        [Route("edit-user")]
        public async Task<ActionResult<string>> EditUser([FromBody] EditUserDto userDetails)
        {
            var tokenService = new TokenService(_configuration, _userManager);

            var user = await _userManager.Users.Include(x => x.Address)
                .FirstOrDefaultAsync(y => y.Email == userDetails.Email); 

            if (user != null)
            {
                if (user.Address == null)
                {
                    user.Address = new();
                }

                user.Address.Barangay = userDetails.Barangay;
                user.DisplayName = userDetails.DisplayName;
                user.Address.FirstName = userDetails.FirstName;
                user.Address.LastName = userDetails.LastName;
                user.Address.Municipality = userDetails.Municipality;
                user.Address.Province = userDetails.Province;
                user.Address.Region = userDetails.Region;
                user.Address.Street = userDetails.Street;
                user.Address.Zipcode = userDetails.Zipcode;

                var result = await _userManager.UpdateAsync(user);

                if (userDetails.Password != null)
                {
                    var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                    var passwordUpdateResult = await _userManager.ResetPasswordAsync(user, token, userDetails.Password);

                    if (!passwordUpdateResult.Succeeded)
                    {
                        return BadRequest(Json("Password did not update successfully."));
                    }
                }

                if (result.Succeeded)
                {
                    EditUserDto updatedUser = new()
                    {
                        Barangay = user.Address.Barangay,
                        DisplayName = user.DisplayName,
                        FirstName = user.Address.FirstName,
                        LastName = user.Address.LastName,
                        Municipality = user.Address.Municipality,
                        Province = user.Address.Province,
                        Region = user.Address.Region,
                        Street = user.Address.Street,
                        Zipcode = user.Address.Zipcode,
                        Email = user.Email,
                    };

                    return Ok(JsonConvert.SerializeObject(updatedUser));
                }

                return BadRequest(Json("User not found."));
            }

            return BadRequest(Json("Update not successful."));
        }

        [Authorize(Roles = UserRoles.User)]
        [HttpGet]
        [Route("get-user")]
        public async Task<ActionResult<string>> GetUser([FromQuery] string email, [FromQuery] string token)
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
                var userToReturn = new ProfileDto();
                userToReturn.DisplayName = user.DisplayName;
                userToReturn.Email = user.Email;

                if (user.Address != null)
                {
                    userToReturn.FirstName = user.Address.FirstName;
                    userToReturn.LastName = user.Address.LastName;
                    userToReturn.Street = user.Address.Street;
                    userToReturn.Region = user.Address.Region;
                    userToReturn.Province = user.Address.Province;
                    userToReturn.Zipcode = user.Address.Zipcode;
                    userToReturn.Municipality = user.Address.Municipality;
                    userToReturn.Barangay = user.Address.Barangay;
                }

                return Ok(JsonConvert.SerializeObject(userToReturn));
            }

            return Ok("User not found.");
        }

        [Authorize(Roles = UserRoles.User)]
        [HttpGet]
        [Route("get-user-roles")]
        public async Task<ActionResult<string>> GetUserRoles([FromQuery] string email)
        {

            var user = await _userManager.Users.Include(x => x.Address)
                .FirstOrDefaultAsync(y => y.Email == email);

            if (user != null)
            {
                var userRolesList = new List<string>();
                var userRoles = await _userManager.GetRolesAsync(user);

                if (userRoles != null)
                {
                    foreach (var role in userRoles)
                    {
                        userRolesList.Add(role);
                    }
                }

                return Ok(userRolesList);
            }

            return Ok("User not found.");
        }

        [Authorize(Roles = UserRoles.Admin)]
        [HttpGet]
        [Route("get-allUsers")]
        public async Task<ActionResult<List<UserToReturnDto>>> GetAllUsers(
            [FromQuery] int pageNumber, [FromQuery] int itemsToShow,
            [FromQuery] string? searchString)
        {
            var userList =  await _userManager.Users.Include(x => x.Address).ToListAsync();

            if (searchString != null)
            {
                userList = userList.Where(x => 
                    (x.Address.FirstName + " " + x.Address.LastName + " " + x.DisplayName)
                    .Contains(searchString)).ToList();
            }

            if (pageNumber != 0 && itemsToShow != 0)
            {
                userList = userList.Skip((pageNumber - 1) * itemsToShow).Take(itemsToShow).ToList();
            }

            var userListToReturn = new List<UserToReturnDto>();

            foreach (var user in userList)
            {
                UserToReturnDto userToAdd = new UserToReturnDto
                {
                    DisplayName = user.DisplayName ?? null,
                    Email = user.Email ?? null,
                    Id = user.Id
                    
                };

                var userRoles = await _userManager.GetRolesAsync(user);

                if (userRoles != null)
                {
                    foreach (var role in userRoles)
                    {
                        userToAdd.UserRoles.Add(role);
                    }
                }

                if (user.Address != null)
                {
                    userToAdd.FirstName = user.Address.FirstName ?? null;
                    userToAdd.LastName = user.Address.LastName ?? null;
                    userToAdd.Municipality = user.Address.Municipality ?? null;
                    userToAdd.Province = user.Address.Province ?? null;
                    userToAdd.Region = user.Address.Region ?? null;
                    userToAdd.Street = user.Address.Street ?? null;
                    userToAdd.Zipcode = user.Address.Zipcode ?? null;
                    userToAdd.Barangay = user.Address.Barangay ?? null;
                }

                userListToReturn.Add(userToAdd);
            }

            return userListToReturn;
        }

        [Authorize(Roles = UserRoles.Admin)]
        [HttpPost]
        [Route("edit-user-admin")]
        public async Task<ActionResult<string>> EditUserAdmin([FromBody] EditUserDto userDetails)
        {
            var user = await _userManager.Users.Include(x => x.Address)
                .FirstOrDefaultAsync(y => y.Email == userDetails.Email);

            if (user == null) return BadRequest("User not found");

            if (userDetails.DisplayName != null) user.DisplayName = userDetails.DisplayName;

            if (user.Address == null)
            {
                user.Address = new Address();
            }

            if (userDetails.FirstName != null) user.Address.FirstName = userDetails.FirstName;
            if (userDetails.LastName != null) user.Address.LastName = userDetails.LastName;
            if (userDetails.Municipality != null) user.Address.Municipality = userDetails.Municipality;
            if (userDetails.Province != null) user.Address.Province = userDetails.Province;
            if (userDetails.Region != null) user.Address.Region = userDetails.Region;
            if (userDetails.Street != null) user.Address.Street = userDetails.Street;
            if (userDetails.Zipcode != null) user.Address.Zipcode = userDetails.Zipcode;
            if (userDetails.Barangay != null) user.Address.Barangay = userDetails.Barangay;

            if (userDetails.UserRoles != null)
            {
                var allRoles = _roleManager.Roles;

                foreach (var allRoleItem in allRoles)
                {
                    if (!userDetails.UserRoles.Contains(allRoleItem.ToString()))
                    {
                        var removeResult = await _userManager.RemoveFromRoleAsync(user, allRoleItem.ToString());
                    }

                    if (userDetails.UserRoles.Contains(allRoleItem.ToString()))
                    {
                        var isInRoleResult = await _userManager.IsInRoleAsync(user, allRoleItem.ToString());
                        if (!isInRoleResult)
                        {
                            var addToRoleResult = await _userManager.AddToRoleAsync(user, allRoleItem.ToString());
                        }
                    }
                }
            }

            var result = await _userManager.UpdateAsync(user);

            if (result.Succeeded) return Json("Success");

            return Json("Update failed.");
        }

        [Authorize(Roles = UserRoles.Admin)]
        [HttpPost]
        [Route("add-user-admin")]
        public async Task<ActionResult<string>> AddUserByAdmin([FromBody] EditUserDto userDetails)
        {
            var userExists = await _userManager.FindByNameAsync(userDetails.DisplayName!);

            if (userExists != null)
            {
                return Json("Already exists");
            }

            var user = new AppUser()
            {
                DisplayName = userDetails.DisplayName!,
                Email = userDetails.Email,
                UserName = userDetails.Email,
            };

            if (user.Address == null)
            {
                user.Address = new Address();
            }

            if (userDetails.FirstName != null) user.Address.FirstName = userDetails.FirstName;
            if (userDetails.LastName != null) user.Address.LastName = userDetails.LastName;
            if (userDetails.Municipality != null) user.Address.Municipality = userDetails.Municipality;
            if (userDetails.Province != null) user.Address.Province = userDetails.Province;
            if (userDetails.Region != null) user.Address.Region = userDetails.Region;
            if (userDetails.Street != null) user.Address.Street = userDetails.Street;
            if (userDetails.Zipcode != null) user.Address.Zipcode = userDetails.Zipcode;
            if (userDetails.Barangay != null) user.Address.Barangay = userDetails.Barangay;


            var result = await _userManager.CreateAsync(user, userDetails.Password!);

            if (!await _roleManager.RoleExistsAsync(UserRoles.Admin))
                await _roleManager.CreateAsync(new IdentityRole(UserRoles.Admin));

            if (!await _roleManager.RoleExistsAsync(UserRoles.User))
                await _roleManager.CreateAsync(new IdentityRole(UserRoles.User));

            //admin registered as both admin and user
            if (await _roleManager.RoleExistsAsync(UserRoles.Admin))
            {
                if (userDetails.UserRoles!.Contains("Admin"))
                    await _userManager.AddToRoleAsync(user, UserRoles.Admin);
            }

            if (await _roleManager.RoleExistsAsync(UserRoles.Admin))
            {
                if (userDetails.UserRoles!.Contains("User"))
                    await _userManager.AddToRoleAsync(user, UserRoles.User);
            }


            if (result.Succeeded)
            {
                return Json("Success");
            }

            return BadRequest(result.Errors);
        }

        [Authorize(Roles = UserRoles.Admin)]
        [HttpGet]
        [Route("search-user")]
        public async Task<ActionResult<List<UserToReturnDto>>> searchUser([FromQuery] string searchString)
        {
            var tokenService = new TokenService(_configuration, _userManager);

            var users = await _userManager.Users.Include(x => x.Address)
                .Where(x => (x.Address != null) ?
                    (x.Address.FirstName + " " + x.Address.LastName + " " + x.Email + " " + x.DisplayName).ToLower().Contains(searchString.ToLower()) :
                    (x.DisplayName + " " + " " + x.Email).ToLower().Contains(searchString.ToLower())).ToListAsync();

            var userListToReturn = new List<UserToReturnDto>();
            foreach (var user in users)
            {
                UserToReturnDto userToAdd = new UserToReturnDto
                {
                    DisplayName = user.DisplayName ?? null,
                    Email = user.Email ?? null,
                    Id = user.Id
                };

                var userRoles = await _userManager.GetRolesAsync(user);

                if (userRoles != null)
                {
                    foreach (var role in userRoles)
                    {
                        userToAdd.UserRoles.Add(role);
                    }
                }

                if (user.Address != null)
                {
                    userToAdd.FirstName = user.Address.FirstName ?? null;
                    userToAdd.LastName = user.Address.LastName ?? null;
                    userToAdd.Municipality = user.Address.Municipality ?? null;
                    userToAdd.Province = user.Address.Province ?? null;
                    userToAdd.Region = user.Address.Region ?? null;
                    userToAdd.Street = user.Address.Street ?? null;
                    userToAdd.Zipcode = user.Address.Zipcode ?? null;
                    userToAdd.Barangay = user.Address.Barangay ?? null;
                }

                userListToReturn.Add(userToAdd);
            }

            return userListToReturn;
        }
    }
}

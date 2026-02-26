using System.Security.Claims;

namespace ShowMeTheMenu.Api.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static string GetUserId(this ClaimsPrincipal user)
    {
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier)
                  ?? user.FindFirstValue("sub");

        return userId ?? throw new UnauthorizedAccessException("User ID claim not found.");
    }
}

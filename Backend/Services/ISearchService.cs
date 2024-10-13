using Backend.Models;

namespace Backend.Services
{
    public interface ISearchService
    {
        Task<ApiResponse<object>> Search(string data);
    }
}

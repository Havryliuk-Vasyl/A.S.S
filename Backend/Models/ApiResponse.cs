namespace Backend.Models
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public T? Data { get; set; }
        public string Message { get; set; }
        public ApiResponse() { 
            this.Success = false;
        }
        public ApiResponse<object> BadRequest(string message)
        {
            return new ApiResponse<object>
            {
                Success = false,
                Data = null,
                Message = message,
            };
        }
    }
}

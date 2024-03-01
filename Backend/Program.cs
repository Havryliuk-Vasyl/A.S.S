// Додайте Microsoft.EntityFrameworkCore та Microsoft.Extensions.DependencyInjection для використання AddDbContext
using Backend.Models;
using Backend.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore.SqlServer;
using System.Globalization; 

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add your services here
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IMediaService, MediaService>();
//builder.Services.AddScoped<IAudioStreamingService, AudioStreamingService>();

// Використовуйте AddDbContext для додавання ApplicationDbContext в контейнер служб
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

WebApplication app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.UseCors(builder =>
    builder.WithOrigins("http://127.0.0.1:5500")
    .AllowAnyMethod()
    .AllowAnyHeader()
);

app.UseCors(builder => 
    builder.WithOrigins("192.168.0.107:8000")
    .AllowAnyMethod()
    .AllowAnyHeader());

app.Run();

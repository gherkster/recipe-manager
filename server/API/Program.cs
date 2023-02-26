using System.Text.Json.Serialization;
using API.Converters;
using API.Extensions;
using API.Models.Database.Context;
using CompressedStaticFiles;
using Microsoft.AspNetCore.SpaServices;
using VueCliMiddleware;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<DatabaseContext>();

builder.Services
    .AddControllers()
    .AddJsonOptions(
        opt =>
        {
            opt.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
            opt.JsonSerializerOptions.Converters.Add(new JsonStringTrimConverter());
        });

builder.Services.ConfigureAuthentication();

if (builder.Environment.IsDevelopment())
{
    // Allow cross origin requests on localhost
    builder.Services.AddCors(options =>
    {
        options.AddDefaultPolicy(policy =>
        {
            policy.SetIsOriginAllowed(origin => new Uri(origin).IsLoopback);
            policy.AllowAnyHeader();
            policy.AllowAnyMethod();
        });
    });
    
}

builder.Services.AddCompressedStaticFiles();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseReDoc();
    app.UseCors();
}

// Rewrite /index.html to /
app.UseDefaultFiles();

app.UseCompressedStaticFiles(new StaticFileOptions()
{
    RequestPath = new PathString("")
});

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseAuthenticationHeader();

// Map client browser requests to fallback to index.html so that a manual refresh does not trigger a 404
app.MapWhen(ctx => !ctx.Request.Path.StartsWithSegments("/api"), client =>
{
    client.UseEndpoints(endpoints =>
    {
        endpoints.MapFallbackToFile("index.html");
    });
});

// Since we don't want the above behaviour for API routes, we don't map a fallback and only map controller endpoints here
app.MapWhen(ctx => !ctx.Request.Path.StartsWithSegments("/api"), api =>
{
    api.UseEndpoints(endpoints =>
    {
        endpoints.MapControllers();
    });
});

if (app.Environment.IsDevelopment())
{
    app.UseEndpoints(endpoints =>
    {
        endpoints.MapToVueCliProxy(
            pattern: "{*path}",
            options: new SpaOptions()
            {
                SourcePath = "../../client", 
                StartupTimeout = TimeSpan.FromSeconds(60)
            },
            // The name of the script in package.json that launches the vue vite server
            npmScript: "dev",
            regex: "ready in .+ ms",
            port: 8080,
            forceKill: true,
            wsl: false);
    });
}

app.Run();
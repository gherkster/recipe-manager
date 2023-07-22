using System;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using RecipeManager.AzureFunctions.Models;

namespace RecipeManager.AzureFunctions.Extensions;

public static class ConfigurationExtensions
{
    public static IServiceCollection AddConfigurationSettings(this IServiceCollection services)
    {
        services.AddOptions<AppSettings>()
            .Configure<IConfiguration>((settings, configuration) =>
            {
                settings.JwtKey = Environment.GetEnvironmentVariable(Constants.JwtKey)!;
                settings.DatabaseName = Environment.GetEnvironmentVariable(Constants.DatabaseNameAppSetting)!;
                settings.RecipeContainerName = Environment.GetEnvironmentVariable(Constants.RecipeContainerNameAppSetting)!;
                settings.UserContainerName = Environment.GetEnvironmentVariable(Constants.UserContainerNameAppSetting)!;
                settings.ConnectionString = Environment.GetEnvironmentVariable(Constants.ConnectionStringAppSetting)!;
                settings.CloudflareBucketAccessKey = Environment.GetEnvironmentVariable(Constants.CloudflareBucketAccessKey)!;
                settings.CloudflareBucketSecretKey = Environment.GetEnvironmentVariable(Constants.CloudflareBucketSecretKey)!;
                settings.CloudflareR2Url = Environment.GetEnvironmentVariable(Constants.CloudflareR2Url)!;
                settings.CloudflareR2BucketName = Environment.GetEnvironmentVariable(Constants.CloudflareR2BucketName)!;
                
                configuration.Bind(settings);
            });

        return services;
    }
}

using Ocelot.DependencyInjection;
using Ocelot.Middleware;
using Microsoft.OpenApi.Models;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Add Ocelot configuration
builder.Configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);

// Add services
builder.Services.AddOcelot(builder.Configuration);
builder.Services.AddEndpointsApiExplorer();

// Configure Swagger
builder.Services.AddSwaggerGen(c =>
{
    // Auth Service Documentation
    c.SwaggerDoc("auth", new OpenApiInfo
    {
        Title = "Auth Service API",
        Version = "v1",
        Description = "Authentication and Authorization Service API",
        Contact = new OpenApiContact
        {
            Name = "Trekking App Team",
            Email = "support@trekkingapp.com"
        }
    });

    // User Service Documentation
    c.SwaggerDoc("user", new OpenApiInfo
    {
        Title = "User Service API",
        Version = "v1",
        Description = "User Management Service API",
        Contact = new OpenApiContact
        {
            Name = "Trekking App Team",
            Email = "support@trekkingapp.com"
        }
    });

    // Booking Service Documentation
    c.SwaggerDoc("booking", new OpenApiInfo
    {
        Title = "Booking Service API",
        Version = "v1",
        Description = "Tour Booking Management Service API",
        Contact = new OpenApiContact
        {
            Name = "Trekking App Team",
            Email = "support@trekkingapp.com"
        }
    });

    // Tour Service Documentation
    c.SwaggerDoc("tour", new OpenApiInfo
    {
        Title = "Tour Service API",
        Version = "v1",
        Description = "Tour Management Service API",
        Contact = new OpenApiContact
        {
            Name = "Trekking App Team",
            Email = "support@trekkingapp.com"
        }
    });

    // Notification Service Documentation
    c.SwaggerDoc("notification", new OpenApiInfo
    {
        Title = "Notification Service API",
        Version = "v1",
        Description = "Notification Management Service API",
        Contact = new OpenApiContact
        {
            Name = "Trekking App Team",
            Email = "support@trekkingapp.com"
        }
    });

    // Payment Service Documentation
    c.SwaggerDoc("payment", new OpenApiInfo
    {
        Title = "Payment Service API",
        Version = "v1",
        Description = "Payment Processing Service API",
        Contact = new OpenApiContact
        {
            Name = "Trekking App Team",
            Email = "support@trekkingapp.com"
        }
    });

    // Add security definition for JWT
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: \"Authorization: Bearer {token}\"",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        // Configure Swagger UI for each service
        c.SwaggerEndpoint("/auth-service/swagger/v1/swagger.json", "Auth Service API");
        c.SwaggerEndpoint("/user-service/swagger/v1/swagger.json", "User Service API");
        c.SwaggerEndpoint("/booking-service/swagger/v1/swagger.json", "Booking Service API");
        c.SwaggerEndpoint("/tour-service/swagger/v1/swagger.json", "Tour Service API");
        c.SwaggerEndpoint("/notification-service/swagger/v1/swagger.json", "Notification Service API");
        c.SwaggerEndpoint("/payment-service/swagger/v1/swagger.json", "Payment Service API");

        // Customize Swagger UI
        c.DocumentTitle = "Trekking App API Documentation";
        c.RoutePrefix = string.Empty; // Serve at root URL
        c.DefaultModelsExpandDepth(-1); // Hide models section by default
        c.DocExpansion(Swashbuckle.AspNetCore.SwaggerUI.DocExpansion.None); // Collapse all endpoints by default
        c.EnableDeepLinking(); // Enable deep linking for direct navigation to specific endpoints
        c.DisplayRequestDuration(); // Show request duration
        c.EnableValidator(); // Enable request/response validation
    });
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthorization();

// Use Ocelot middleware
await app.UseOcelot();

app.Run();

# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["PaymentService.Api/PaymentService.Api.csproj", "PaymentService.Api/"]
COPY ["PaymentService.Infrastructure/PaymentService.Infrastructure.csproj", "PaymentService.Infrastructure/"]
RUN dotnet restore "PaymentService.Api/PaymentService.Api.csproj"

# Copy the rest of the code
COPY . .

# Build and publish
WORKDIR "/src/PaymentService.Api"
RUN dotnet build "PaymentService.Api.csproj" -c Release -o /app/build
RUN dotnet publish "PaymentService.Api.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

# Set environment variables
ENV ASPNETCORE_URLS=http://+:5000
ENV ASPNETCORE_ENVIRONMENT=Production
# Run the application
ENTRYPOINT ["dotnet", "PaymentService.Api.dll"] 
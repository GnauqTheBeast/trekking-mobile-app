# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["PaymentService.Api/PaymentService.Api.csproj", "PaymentService.Api/"]
COPY ["PaymentService.Infrastructure/PaymentService.Infrastructure.csproj", "PaymentService.Infrastructure/"]
COPY ["PaymentService.Core/PaymentService.Core.csproj", "PaymentService.Core/"]
COPY ["PaymentService.Application/PaymentService.Application.csproj", "PaymentService.Application/"]
RUN dotnet restore "PaymentService.Api/PaymentService.Api.csproj"
COPY . .
RUN dotnet publish "PaymentService.Api/PaymentService.Api.csproj" -c Release -o /app/publish

# Runtime stage
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 5001
ENV ASPNETCORE_URLS=http://+:5001
ENTRYPOINT ["dotnet", "PaymentService.Api.dll"] 
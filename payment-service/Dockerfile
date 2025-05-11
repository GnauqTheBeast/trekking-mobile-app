FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy csproj and restore dependencies
COPY ["PaymentService.Api/PaymentService.Api.csproj", "PaymentService.Api/"]
COPY ["PaymentService.Core/PaymentService.Core.csproj", "PaymentService.Core/"]
COPY ["PaymentService.Application/PaymentService.Application.csproj", "PaymentService.Application/"]
COPY ["PaymentService.Infrastructure/PaymentService.Infrastructure.csproj", "PaymentService.Infrastructure/"]

RUN dotnet restore "PaymentService.Api/PaymentService.Api.csproj"

# Copy the rest of the code
COPY . .

# Build and publish
RUN dotnet build "PaymentService.Api/PaymentService.Api.csproj" -c Release -o /app/build
RUN dotnet publish "PaymentService.Api/PaymentService.Api.csproj" -c Release -o /app/publish

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 80
EXPOSE 443
ENTRYPOINT ["dotnet", "PaymentService.Api.dll"] 